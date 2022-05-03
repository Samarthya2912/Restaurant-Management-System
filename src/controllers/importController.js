const pool = require("../database/database");
const { generateId } = require("../functions/id");

//Import Company Crud Operations

module.exports.addImportCompany = async (req, res) => {
  const {
    name,
    address,
    email,
    phone,
    total_transactions,
    remain_transactions
  } = req.body;
  const contact_info_id = generateId("COMP");
  try {
    const insertContact = await pool.query(
      "INSERT INTO contact_info SET name=?,email=?,phone=?,address=?,contact_info_id=?",
      [name, email, phone, address, contact_info_id]
    );
    if (insertContact.affectedRows == 1) {
      const insertCompany = await pool.query(
        "INSERT INTO import_company SET total_transactions=?,remain_transactions=?, import_company_id=?",
        [total_transactions || 0.0, remain_transactions || 0.0, contact_info_id]
      );
      if (insertCompany.affectedRows == 1) {
        return res.send({ message: "Import company successfully added." });
      } else {
        return res.status(400).send({ error: "Unable to add Company." });
      }
    } else {
      return res.status(400).send({
        error: "Unable to add contact informations to create a company."
      });
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(500).send({
        error: "Company with given credentials already exists."
      });
    } else {
      return res.status(500).send({ error });
    }
  }
};

module.exports.getImportCompanies = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT import_company_id,name,phone,email,address,total_transactions,remain_transactions FROM import_company INNER JOIN contact_info ON import_company.import_company_id= contact_info.contact_info_id ORDER BY name`
    );
    if (!results) {
      return res.status(404).json({ error: "Unable to get Companies." });
    }
    return res.send({ import_companies: results });
  } catch (error) {
    return res.send({ error: "Internal Server error." });
  }
};

module.exports.getImportCompany = async (req, res) => {
  const { import_company_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT import_company_id,name,phone,email,address,total_transactions,remain_transactions FROM import_company INNER JOIN contact_info ON import_company.import_company_id= contact_info.contact_info_id where import_company_id=? ORDER BY name`,
      [import_company_id]
    );
    if (!result) {
      return res.status(404).json({ error: "Couldn't get Company." });
    }
    return res.send(result);
  } catch (error) {
    return res.send({ error: "Internal Server error." });
  }
};

module.exports.updateImportCompany = async (req, res) => {
  const {
    name,
    address,
    phone,
    email,
    total_transactions,
    remain_transactions
  } = req.body;
  const { import_company_id } = req.params;
  if (!import_company_id) {
    return res.status(403).send({ error: "Cannot update Company." });
  }
  try {
    const updateContact = await pool.query(
      "UPDATE contact_info SET name=?,address=?,email=?,phone=? WHERE contact_info_id=?",
      [name, address, email, phone, import_company_id]
    );
    if (updateContact.affectedRows == 1) {
      const updateCompany = await pool.query(
        "UPDATE import_company SET total_transactions=?,remain_transactions=? WHERE import_company_id=?",
        [total_transactions, remain_transactions, import_company_id]
      );
      if (updateCompany.affectedRows == 1) {
        return res.send({ message: "Import Company Successfully updated." });
      } else {
        return res.status(400).send({ error: "Unable to update company." });
      }
    } else {
      return res.status(400).send({ error: "Unable to update company." });
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY")
      return res
        .status(500)
        .send({ error: `Company credentils already exists.` });
    else return res.status(500).send({ error });
  }
};

module.exports.deleteImportCompany = async (req, res) => {
  const { import_company_id } = req.params;
  try {
    const CompanyDeleteresult = await pool.query(
      "DELETE FROM import_company WHERE import_company_id=?",
      [import_company_id]
    );
    if (CompanyDeleteresult.affectedRows == 1) {
      const ContactDeleteresult = await pool.query(
        "DELETE FROM contact_info WHERE contact_info_id=?",
        [import_company_id]
      );
      if (ContactDeleteresult.affectedRows == 1) {
        return res.send({ message: " Import Company Successfully deleted." });
      } else {
        return res.status(400).send({ error: "Unable to delete company." });
      }
    } else {
      return res.status(400).send({ error: "Unable to delete company." });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
};

// Import crud operations

module.exports.addImport = async (req, res) => {
  const {
    import_company_id,
    bill_no,
    import_date,
    total_price,
    import_details
  } = req.body;
  if (
    (!import_company_id ||
      import_company_id.length == 0 ||
      !bill_no ||
      bill_no.length == 0,
    !import_date || import_date == 0 || !total_price || total_price.length == 0)
  ) {
    return res.status(422).send({
      error: "All informations related to an import must be provided."
    });
  }
  try {
    const insertImport = await pool.query(
      "INSERT INTO import SET import_company_id=?,bill_no=?,total_price=?,import_date=?",
      [
        import_company_id,
        parseInt(bill_no),
        parseFloat(total_price),
        import_date
      ]
    );
    if (insertImport.affectedRows == 1) {
      for (let i = 0; i < import_details.length; i++) {
        const insertImportDetails = await pool.query(
          "INSERT INTO import_detail SET import_good=?,bill_no=?,quantity=?,price=?,import_type=?",
          [
            import_details[i].import_good,
            bill_no,
            import_details[i].quantity,
            parseFloat(import_details[i].price),
            import_details[i].import_type
          ]
        );
        if (insertImportDetails.affectedRows != 0) {
          const getStock = await pool.query(
            "SELECT * FROM stock WHERE stock_name=?",
            [import_details[i].import_good]
          );
          if (getStock.length == 0) {
            await pool.query(
              "INSERT INTO stock SET stock_name=?, type_of_stock=?,last_import_date=?,quantity=?",
              [
                import_details[i].import_good,
                import_details[i].import_type,
                import_date,
                import_details[i].quantity
              ]
            );
          } else {
            await pool.query(
              "UPDATE stock SET type_of_stock=?,last_import_date=?,quantity=quantity+? WHERE stock_name=?",
              [
                import_details[i].import_type,
                import_date,
                import_details[i].quantity,
                import_details[i].import_good
              ]
            );
          }
        }
      }

      return res.send({ message: "Import successfully added." });
    } else {
      return res.status(400).send({
        error: "Unable to add an import."
      });
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(500).send({
        error: "Import with given information already exists."
      });
    } else {
      return res.status(500).send({ error });
    }
  }
};

module.exports.getImports = async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT import_company_id,import.bill_no,total_price,import_date FROM import ORDER BY import_date LIMIT ?,20",
      [(parseInt(req.query.page) - 1) * 20]
    );
    if (!results) {
      return res.status(404).json({ error: "Unable to get Imports" });
    }
    return res.send({ imports: results });
  } catch (error) {
    return res.send({ error });
  }
};

module.exports.getImport = async (req, res) => {
  const { bill_no } = req.params;
  try {
    const result = await pool.query(
      `SELECT import_company_id,import.bill_no,total_price,import_date,quantity,price,import_good FROM import INNER JOIN import_detail ON import.bill_no= import_detail.bill_no WHERE import.bill_no=?`,
      [bill_no]
    );
    if (!result) {
      return res
        .status(404)
        .json({ error: "Couldn't get import associated with the bill." });
    }
    if (result.length > 0) {
      const import_company_id = result[0].import_company_id;
      const bill_no = result[0].bill_no;
      const total_price = result[0].total_price;
      const import_date = result[0].import_date;
      result.forEach(rslt => {
        delete rslt.import_company_id;
        delete rslt.bill_no;
        delete rslt.total_price;
        delete rslt.import_date;
      });
      return res.send({
        import_company_id,
        bill_no,
        total_price,
        import_date,
        import_details: result
      });
    }
    return res.send(result);
  } catch (error) {
    return res.send({ error });
  }
};

module.exports.getImportsByCompany = async (req, res) => {
  const { import_company_id } = req.params;
  try {
    const result1 = await pool.query(
      "SELECT bill_no,total_price,import_date FROM import WHERE import_company_id=? ORDER BY import_date LIMIT ?,20",
      [import_company_id, (parseInt(req.query.page) - 1) * 20]
    );
    if (!result1) {
      return res.status(404).json({
        error: "Couldn't get import associated with the import Company."
      });
    }
    if (result1.length > 0) {
      for (let i = 0; i < result1.length; i++) {
        const detail = await pool.query(
          "SELECT quantity,price,import_good FROM import_detail WHERE bill_no=?",
          [result1[i].bill_no]
        );
        result1[i].import_detail = detail;
      }
      return res.send({ import_company_id, imports: result1 });
    }
    return res.send({ error: "No data found" });
  } catch (error) {
    return res.send({ error });
  }
};

module.exports.deleteImport = async (req, res) => {
  const { bill_no } = req.params;
  try {
    await pool.query("SET FOREIGN_KEY_CHECKS=0");
    const ImportDeleteresult = await pool.query(
      "DELETE FROM import WHERE bill_no=?",
      [bill_no]
    );
    await pool.query("SET FOREIGN_KEY_CHECKS=1");
    if (ImportDeleteresult.affectedRows == 1) {
      return res.send({ message: " Import Successfully deleted." });
    } else {
      return res.status(400).send({ error: "Unable to delete import." });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
};
