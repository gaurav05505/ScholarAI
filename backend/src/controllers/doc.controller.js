import DocModel from '../models/doc.model.js';
import ChatModel from '../models/chat.model.js';


async function uploadDoc(req, res) {
  try {
    const requestedSourceType = (req.body.sourceType || (req.file ? 'pdf' : 'url'))
      .toString()
      .toLowerCase();
    const sourceType = ['pdf', 'url'].includes(requestedSourceType)
      ? requestedSourceType
      : null;

    if (!sourceType) {
      return res.status(400).json({
        success: false,
        message: 'sourceType must be either pdf or url',
      });
    }

    const uploadedFile = req.file;
    const sourceUrl = (req.body.sourceUrl || req.body.url || '').trim();
    const providedTitle = req.body.title?.trim();

    let title = providedTitle;
    let storageFileId = null;
    let originalName = null;
    let fileSize = null;
    let mimeType = null;

    if (sourceType === 'pdf') {
      if (!uploadedFile) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a PDF file',
        });
      }

      originalName = uploadedFile.originalname;
      fileSize = uploadedFile.size;
      mimeType = uploadedFile.mimetype;
      title = title || uploadedFile.originalname.replace(/\.pdf$/i, '');
      storageFileId = await savePdfToGridFs({
        buffer: uploadedFile.buffer,
        filename: uploadedFile.originalname,
        contentType: uploadedFile.mimetype,
      });
    }

    if (sourceType === 'url') {
      if (!sourceUrl) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid sourceUrl',
        });
      }

      let parsedUrl;
      try {
        parsedUrl = new URL(sourceUrl);
      } catch {
        return res.status(400).json({
          success: false,
          message: 'sourceUrl must be a valid URL',
        });
      }

      title = title || parsedUrl.hostname.replace(/^www\./i, '');
    }

    const document = await DocModel.create({
      user: req.user._id,
      sourceType,
      title,
      originalName,
      sourceUrl: sourceType === 'url' ? sourceUrl : undefined,
      storageFileId,
      fileSize,
      mimeType,
      status: 'queued',
      metadata: {
        ingestionMode: sourceType,
        sourceUrl: sourceType === 'url' ? sourceUrl : null,
      },
    });

    enqueueDocumentProcessing(document._id);

    return res.status(202).json({
      success: true,
      message: 'Document queued for processing',
      data: document,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload document',
    });
  }
}

async function askDocQuestion(req, res) {
  try {
    const { id } = req.params;
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'question is required',
      });
    }

    const doc = await DocModel.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    if (doc.status !== 'completed') {
      return res.status(409).json({
        success: false,
        message: 'Document is still processing. Please try again after upload finishes.',
      });
    }

    const result = await answerDocumentQuestion({
      doc,
      question: question.trim(),
      userId: req.user._id,
    });

    const chat = await ChatModel.create({
      user: req.user._id,
      doc: doc._id,
      question: question.trim(),
      answer: result.answer,
      provider: result.provider,
      model: result.model,
      sources: result.sources,
    });

    return res.status(200).json({
      success: true,
      message: 'Answer generated successfully',
      data: {
        chat,
        sources: result.sources,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to answer question',
    });
  }
}

async function deleteDoc(req, res) {
  try {
    const { id } = req.params;

    const doc = await DocModel.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    if (doc.storageFileId) {
      try {
        await deletePdfFromGridFs(doc.storageFileId);
      } catch (error) {
        console.error('File deletion error:', error.message);
      }
    }

    await ChatModel.deleteMany({
      doc: doc._id,
      user: req.user._id,
    });

    await DocModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete document',
    });
  }
}

async function listDocs(req, res) {
  try {
    const docs = await DocModel.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: docs.length,
      data: docs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch documents',
    });
  }
}

async function getDocById(req, res) {
  try {
    const { id } = req.params;

    const doc = await DocModel.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch document',
    });
  }
}

async function updateDoc(req, res) {
  try {
    const { id } = req.params;
    const { title, status, sourceUrl, metadata, errorMessage, chunkCount, vectorCount } = req.body;

    const doc = await DocModel.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    if (title !== undefined) doc.title = title.trim();
    if (status !== undefined) doc.status = status;
    if (sourceUrl !== undefined) doc.sourceUrl = sourceUrl;
    if (metadata !== undefined) doc.metadata = metadata;
    if (errorMessage !== undefined) doc.errorMessage = errorMessage;
    if (chunkCount !== undefined) doc.chunkCount = chunkCount;
    if (vectorCount !== undefined) doc.vectorCount = vectorCount;

    await doc.save();

    return res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: doc,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update document',
    });
  }
}

export default {
  uploadDoc,
  listDocs,
  getDocById,
  updateDoc,
  deleteDoc,
  askDocQuestion,
};
