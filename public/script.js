$(document).ready(function () {
  getDataPoint()

  // open add-point modal form
  $('.btn-add-point').click(function () {
    $('.modal').toggleClass('is-active')
  })

  $('#point-table').DataTable()


  // on click event
  $(document).click(async function (e) {
    // close modal
    if ($(e.target).hasClass('close-modal')) {
      $('.modal').toggleClass('is-active')
      $('input-form input').val('')
    }

    // submit form button
    if ($(e.target).hasClass('btn-submit')) {
      const form_data = new FormData($('#input-form')[0])
      // form_data.forEach((value, key) => console.log(key, value))

      // if form-data has id field submit as update
      if (form_data.has('id')) updatePoint(form_data)
      else postPoint(form_data)
    }

    // edit button
    if ($(e.target).hasClass('edit-point')) {
      const point_id = e.target.dataset.id
      const selectPoint = await getPointById(point_id)
      if (selectPoint.status !== 'ok') alert(selectPoint.msg)
      else showUpdateForm(selectPoint.data)
    }

    // delete button
    if ($(e.target).hasClass('delete-point')) {
      const point_id = e.target.dataset.id
      deletePoint(point_id)
    }
  })

  // Read
  async function getDataPoint() {
    const data_point = await fetch('/point', { method: 'GET' })
      .then((res) => res.json())
      .then((res) => res.data)

    dataToTable(data_point)
    showPointOnMap(data_point)
  }

  // Read by ID
  function getPointById(point_id) {
    return fetch('/point/' + point_id, { method: 'GET' })
      .then((res) => res.json())
      .then((res) => res)
  }

  // Create
  async function postPoint(form_data) {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(form_data))
    }

    const posting = await fetch('/point', options)
      .then((res) => res.json())
      .then((res) => res)

    alert(posting.msg)
    location.reload()

  }

  // Update
  function showUpdateForm(point) {
    $('.modal-card-title').html('Edit Point')

    const id_field = `<input class="input is-small" type="hidden" name="id" id="id" value="${point.id}">`

    $('#input-form').prepend(id_field)
    $('#label').val(point.label)
    $('#kota_kab').val(point.kota_kab)
    $('#provinsi').val(point.provinsi)
    $('#latitude').val(point.latitude)
    $('#longitude').val(point.longitude)

    $('.modal').toggleClass('is-active')
  }

  async function updatePoint(form_data) {
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(form_data))
    }

    const updating = await fetch('/point', options)
      .then((res) => res.json())
      .then((res) => res)

    alert(updating.msg)
    location.reload()
  }

  // Delete
  async function deletePoint(point_id) {
    const data = { id: point_id }
    const options = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }

    const deleting = await fetch('/point', options)
      .then((res) => res.json())
      .then((res) => res)

    alert(deleting.msg)
    location.reload()
  }

  function dataToTable(data_point) {
    let rows = ''
    data_point.forEach((point) => {
      rows += `
        <tr>
          <td>${point.label}</td>
          <td>${point.kota_kab}</td>
          <td>${point.provinsi}</td>
          <td>${point.latitude}</td>
          <td>${point.longitude}</td>
          <td><a href="#" class="edit-point" data-id="${point.id}">Edit</a> | <a href="#" class="delete-point"
          data-id="${point.id}">Delete</a></td>
        </tr>
      `
    })

    $('tbody').html(rows)
  }

  class Point {
    constructor(point_name, longitude, latitude) {
      this.point_name = point_name
      this.longitude = longitude
      this.latitude = latitude
    }

    pointMarkFeature() {
      const lonLat = [this.longitude, this.latitude]

      return new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(lonLat)),
        name: this.point_name
      })
    }
  }

  function createPointObj(data_point) {
    let arrOfObj = []
    data_point.forEach((point) => {
      point.label = new Point(point.label, point.longitude, point.latitude)
      arrOfObj.push(point.label)
    })
    return arrOfObj
  }

  async function showPointOnMap(data_point) {
    const point_obj = await createPointObj(data_point)

    const pointsMark = []
    point_obj.forEach((point) => {
      pointsMark.push(point.pointMarkFeature())
    })

    await setPointMarkStyle(pointsMark)

    setMap(pointsMark)
  }

  function markStyle(point_name) {
    const point_svg = `
        <svg width="40" height="80" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zM16 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"></path>
        </svg>
      `

    return new ol.style.Style({
      image: new ol.style.Icon({
        src: `data:image/svg+xml;utf8,${point_svg}`,
        scale: 0.7
      }),
      text: new ol.style.Text({
        text: point_name,
      })
    })
  }

  function setPointMarkStyle(pointsMark) {
    pointsMark.forEach((item) => item.setStyle(markStyle(item.get('name'))))
  }

  function setMap(pointsMark) {
    const vectorSource = new ol.source.Vector({
      features: pointsMark,
    })

    const vectorLayer = new ol.layer.Vector({
      source: vectorSource,
    })

    const tileLayer = new ol.layer.Tile({
      source: new ol.source.OSM()
    })

    const map = new ol.Map({
      layers: [tileLayer, vectorLayer],
      target: 'map',
      view: new ol.View({
        center: [0, 0],
        zoom: 1,
      })
    })

    return map
  }
})


