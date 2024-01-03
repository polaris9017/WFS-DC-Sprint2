const express = require('express');
const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    const {catId, isNew} = req.query;
    if (catId && isNew) res.send('카테고리별 도서 조회');
    else if (!catId && !isNew) res.send('전체 도서 조회');
});
router.get('/:bookid', (req, res) => {
    res.send('개별 도서 조회');
});

module.exports = router;