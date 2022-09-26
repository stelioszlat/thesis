const { Router } = require("express");

const meta = require("../controllers/meta-controller");
const metaValidation = require('../validation/metadataValidation');

const editRoutes = require('./edit-routes');

const router = Router();

// /api/metadata
router.post("/file/new", meta.addMetadata);
router.get("/files", meta.getMetadata);
router.get("/file/:fid", meta.hasValidId, meta.getMetadataById);
router.delete('/file/:fid', meta.hasValidId, meta.deleteMetadataById);
router.use(editRoutes);

module.exports = router;