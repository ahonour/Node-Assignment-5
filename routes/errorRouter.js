const express = require('express');
const errorRouter = express.Router();
const path = require('path');

errorRouter.use((req, res) => {
  res.status(404).render('error');
});

module.exports = errorRouter;
