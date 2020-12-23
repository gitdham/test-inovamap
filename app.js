const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

const controller = require('./controller')
app.route('/')
  .get(controller.homePage)
  .post(controller.insertPoint)
  .put(controller.updatePoint)
  .delete(controller.deletePoint)

app.route('/point/:id')
  .get(controller.selectPointById)


app.listen(port, () => console.log(`Server started on port ${port}`))
