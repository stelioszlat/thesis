
const mongoose = require('mongoose');
const Metadata = require('../models/metadata');
const cache = require('../util/redis-util');
const index = require('../util/elastic-util');

exports.addMetadata = async (req, res, next) => {

    const {fileName, uploader, keywords} = req.body;

    const addedMeta = new Metadata({
        fileName: fileName,
        uploader: uploader,
        timesQueried: 0,
        timesModified: 0,
        version: 1,
        keywords: keywords
    });

    try {
        const file = await addedMeta.save();

        await cache.set(file._id, file);

        // index.addIndex(fileName, addedMeta);

        res.status(200).json(file);
    }
    catch(err){
        return next(err);
    }
};

exports.getMetadata = async (req, res, next) => {
    // need to add pagination
    let {
        page,
        limit
    } = req.query;
    // search cache first
    
    try {
        const files = await Metadata.find().limit(+limit).skip((+page - 1) * +limit);

        let count = await Metadata.countDocuments();
        
        if (!files) {
            return res.status(404).json({ message: 'Could not find any files.' });
        }

        res.status(200).json({
            page,
            limit,
            count,
            currentPage: Math.ceil(count / limit),
            files
        });
    }
    catch(err) {
        next(err);
    }
}

exports.getMetadataById = async (req, res, next) => {
    
    const fileId = req.params.fid;

    try {
        const file = await Metadata.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: 'Could not find file.' });
        }

        res.status(200).json(file);
    }
    catch(err){
        return next(err);
    }
}

exports.deleteMetadataById = async (req, res, next) => {

    const fileId = req.params.fid;

    try {
        const file = await Metadata.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: 'Could not find file.' });
        }

        const result = await Metadata.findByIdAndDelete(fileId);

        res.status(200).json(result);

    } catch(err) {
        return next(err);
    }
}

exports.hasValidId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.fid)) {
        return res.status(404).json({ message: 'Could not find file.' });
    }
    
    next();
}