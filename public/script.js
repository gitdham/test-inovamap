$(document).ready(function () {
  // get data from database
  getDataPoint()

  // open add-point modal form
  $('.btn-add-point').click(function () {
    $('.modal').toggleClass('is-active')
  })

  // on click event
  $(document).click(async function (e) {
    // close modal
    if ($(e.target).hasClass('close-modal')) {
      $('.modal').toggleClass('is-active')
    }

    // submit form button
    if ($(e.target).hasClass('btn-submit')) {
      const form_data = new FormData($('#input-form')[0])
      // form_data.forEach((value, key) => console.log(key, value))

      // if form-data has id field submit as update
      if (form_data.has('id')) updatePoint(form_data)
      else postPoint(form_data)
    }
  })

  // Read
  async function getDataPoint() {
    const point_data = await fetch('/point', { method: 'GET' })
      .then((res) => res.json())
      .then((res) => res.data)

    await setGeoMarker(point_data)
    await setGeoPointStyle(point_data)
    renderMap(point_data)
    dataToTable(point_data)
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
  async function showUpdateForm(point_id) {
    const selected_point = await getPointById(point_id)

    if (selected_point.status !== 'ok') {
      alert(selected_point.msg)
    } else {
      const data = selected_point.data
      $('.modal-card-title').html('Edit Point')

      const id_field = `<input class="input is-small" type="hidden" name="id" id="id" value="${data.id}">`

      $('#input-form').prepend(id_field)
      $('#label').val(data.label)
      $('#kota_kab').val(data.kota_kab)
      $('#provinsi').val(data.provinsi)
      $('#latitude').val(data.latitude)
      $('#longitude').val(data.longitude)

      $('.modal').toggleClass('is-active')
    }
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

  function setGeoMarker(point_data) {
    point_data.forEach((item) => {
      item.point = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([item.longitude, item.latitude]))
      })
    })
  }

  function setGeoPointStyle(point_data) {
    point_data.forEach((item) => {
      const point_svg = `
        <svg width="40" height="80" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zM16 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"></path>
        </svg>
      `

      const point_style = new ol.style.Style({
        image: new ol.style.Icon({
          src: `data:image/svg+xml;utf8,${point_svg}`,
          scale: 0.7
        }),
        text: new ol.style.Text({
          text: item.label
        })
      })
      item.point.setStyle(point_style)
    })
  }

  function renderMap(point_data) {
    const pointsMark = []
    point_data.forEach((item) => pointsMark.push(item.point))

    const vectorSource = new ol.source.Vector({
      features: pointsMark
    })

    const vectorLayer = new ol.layer.Vector({
      source: vectorSource
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
        maxZoom: 20
      })
    })

    return map
  }

  function dataToTable(data_point) {
    const table = $('#data-table').DataTable({
      data: data_point,
      columns: [
        { data: 'label' },
        { data: 'kota_kab' },
        { data: 'provinsi' },
        { data: 'latitude' },
        { data: 'longitude' },
        { data: 'aksi' }
      ],
      columnDefs: [{
        targets: -1,
        data: null,
        defaultContent: '<button class="edit">edit</button> <button class="del">delete</button>'
      }]
    })

    $('#data-table .edit').click(function () {
      const data = table.row($(this).parents('tr')).data()
      showUpdateForm(data.id)
    })

    $('#data-table .del').click(function () {
      const data = table.row($(this).parents('tr')).data()
      deletePoint(data.id)
    })

    return table
  }
})


