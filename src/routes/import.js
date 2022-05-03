const router = require("express").Router();
const { contactValidator } = require("../middlewares/contactvalidator");
const importController = require("../controllers/importController");
router.post(
  "/import/companies",
  contactValidator,
  importController.addImportCompany
);
router.post("/import/import", importController.addImport);
router.get("/import/companies", importController.getImportCompanies);
router.get("/import/imports", importController.getImports);
router.get(
  "/import/company/:import_company_id",
  importController.getImportCompany
);
router.get("/import/import/:bill_no", importController.getImport);
router.get(
  "/import/:import_company_id/imports",
  importController.getImportsByCompany
);
router.patch(
  "/import/updatecompany/:import_company_id",
  contactValidator,
  importController.updateImportCompany
);
router.delete(
  "/import/deletecompany/:import_company_id",
  importController.deleteImportCompany
);
router.delete("/import/deleteimport/:bill_no", importController.deleteImport);
module.exports = router;
