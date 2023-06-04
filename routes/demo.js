var express = require('express');

var router = express.Router();

// 获取项目
router.get('/', async function (req, res, next) {});

// 新增 项目
router.post('/', async function (req, res, next) {});

// 修改 项目
router.put('/:id', async function (req, res, next) {});

// 删除 项目
router.delete('/:id', async function (req, res, next) {});

module.exports = router;
