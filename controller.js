const connection = require('./db_connection')

function checkPointName(label) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM point WHERE label = '${label}'`, (err, result) => {
      if (err) throw err
      else resolve(result.rows)
    })
  })
}

exports.homePage = (req, res) => {
  connection.query('SELECT * FROM point', (err, result) => {
    if (err) throw err
    else res.render('index', { points: result.rows })
  })
}

exports.insertPoint = async (req, res) => {
  // console.log(req.body)
  const label = req.body.label
  const kota_kab = req.body.kota_kab
  const provinsi = req.body.provinsi
  const latitude = req.body.latitude
  const longitude = req.body.longitude

  // check nama point
  const nama_point = await checkPointName(label)
  // console.log(result)
  if (nama_point.length > 0) {
    res.send({
      status: 'fail',
      msg: `Label dengan nama ${label} sudah ada`
    })
  } else {
    connection.query(`INSERT INTO point VALUES (default, '${label}', '${kota_kab}', '${provinsi}', '${latitude}', '${longitude}')`, (err, result) => {
      if (err) throw err
      else res.send({
        status: 'ok',
        msg: `Menambahkan point: ${label}`
      })
      // else redirect('/')
    })
  }
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

exports.updatePoint = (req, res) => {
  // console.log(req.body)
  const id = req.body.id
  const label = req.body.label
  const kota_kab = req.body.kota_kab
  const provinsi = req.body.provinsi
  const latitude = req.body.latitude
  const longitude = req.body.longitude
  connection.query(`UPDATE point SET label = '${label}', kota_kab = '${kota_kab}', provinsi = '${provinsi}', latitude = '${latitude}', longitude = '${longitude}' WHERE id = '${id}'`, (err, result) => {
    if (err) throw err
    else res.send({
      status: 'ok',
      msg: `Menupdate point id: ${id} berhasil`
    })
    // else redirect('/')
  })
}

exports.deletePoint = (req, res) => {
  const id = req.body.id
  // console.log(req.body)
  connection.query(`DELETE FROM point WHERE id = ${id}`, (err, result) => {
    if (err) throw err
    else res.send({
      status: 'ok',
      msg: `Deleting point with id: ${id}`
    })
    // else res.redirect('/')
  })
}


