const connection = require('./db_connection')

exports.homePage = (req, res) => {
  res.render('index')
}

exports.selectAllPoint = (req, res) => {
  connection.query('SELECT * FROM point', (err, result) => {
    if (err) throw err
    else {
      res.send({
        status: 'ok',
        data: result.rows
      })
    }
  })
}

exports.insertPoint = async (req, res) => {
  const label = req.body.label.toUpperCase()
  const kota_kab = req.body.kota_kab.toUpperCase()
  const provinsi = req.body.provinsi.toUpperCase()
  const latitude = req.body.latitude.toUpperCase()
  const longitude = req.body.longitude.toUpperCase()

  connection.query(`INSERT INTO point VALUES (default, '${label}', '${kota_kab}', '${provinsi}', '${latitude}', '${longitude}')`, (err, result) => {
    if (err) throw err
    else res.send({
      status: 'ok',
      msg: `Menambahkan point: ${label}`
    })
  })
}

exports.selectPointById = (req, res) => {
  const id = req.params.id
  connection.query(`SELECT * FROM point WHERE id = '${id}'`, (err, result) => {
    if (err) throw err
    if (result.rows < 1) {
      res.send({
        status: 'fail',
        msg: `Data point tidak ditemukan`
      })
    } else {
      res.send({
        status: 'ok',
        data: result.rows[0]
      })
    }
  })
}

exports.updatePoint = async (req, res) => {
  const id = req.body.id
  const label = req.body.label.toUpperCase()
  const kota_kab = req.body.kota_kab.toUpperCase()
  const provinsi = req.body.provinsi.toUpperCase()
  const latitude = req.body.latitude.toUpperCase()
  const longitude = req.body.longitude.toUpperCase()

  connection.query(`UPDATE point SET label = '${label}', kota_kab =' ${kota_kab}', provinsi = '${provinsi}', latitude = '${latitude}', longitude = '${longitude}' WHERE id = ${id}`, (err, result) => {
    if (err) throw err
    else res.send({
      status: 'ok',
      msg: `Menupdate point id: ${id} berhasil`
    })
  })
}

exports.deletePoint = (req, res) => {
  const id = req.body.id
  connection.query(`DELETE FROM point WHERE id = ${id}`, (err, result) => {
    if (err) throw err
    else res.send({
      status: 'ok',
      msg: `Deleting point with id: ${id}`
    })
  })
}


