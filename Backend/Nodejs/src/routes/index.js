const { Router } = require('express');
const router = Router();

router.get('/hola', 
    (req,res) => res.json
    (
        {msg: 'Holis'}
    )
);

module.exports = router;