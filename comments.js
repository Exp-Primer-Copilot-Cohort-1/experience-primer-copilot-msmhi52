// Create web server

// Import modules
const express = require('express')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')
const { Comment } = require('../models')

// Create router
const router = express.Router()

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Create GET /comments
router.get('/', (req, res) => {
  Comment.findAll({
    order: [
      ['id', 'DESC']
    ]
  }).then(comments => {
    res.render('comments/index', { comments })
  })
})

// Create GET /comments/new
router.get('/new', (req, res) => {
  res.render('comments/new')
})

// Create POST /comments
router.post('/', urlencodedParser, [
  check('email').isEmail().withMessage('Email is invalid'),
  check('content').isLength({ min: 5 }).withMessage('Content is too short')
], (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.render('comments/new', {
      errors: errors.array(),
      comment: req.body
    })
  } else {
    Comment.create(req.body).then(() => {
      res.redirect('/comments')
    })
  }
})

// Export router
module.exports = router