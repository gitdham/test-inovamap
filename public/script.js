$(document).ready(function () {
  $('.btn-add-point').click(function () {
    $('.modal').toggleClass('is-active')
  })

  $('input').keyup(function () {
    this.value = this.value.toLocaleUpperCase();
  });

  // MAP
  const map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([37.41, 8.82]),
      zoom: 4
    })
  })

  map.on('singleclick', function (e) {
    const lat_long = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326')
    const lat = lat_long[1]
    const long = lat_long[0]
    addPoint(lat, long)
  })

  function addPoint(lat, long) {
    $('.modal').toggleClass('is-active')
    $('#latitude').val(lat)
    $('#longitude').val(long)
  }

  $('#point-table').DataTable()

  $(document).click(async function (e) {
    // close modal
    if ($(e.target).hasClass('close-modal')) {
      $('.modal').toggleClass('is-active')
      $('input').val('')
    }

    // post point form
    if ($(e.target).hasClass('btn-submit')) {
      const form_data = new FormData($('#input-form')[0])
      // form_data.forEach((value, key) => console.log(key, value))

      if (form_data.has('id')) updatePoint(form_data)
      else postPoint(form_data)
    }

    if ($(e.target).hasClass('edit-point')) {
      const point_id = e.target.dataset.id
      let selectPoint = await getPointById(point_id)
      if (selectPoint.status !== 'ok') alert(selectPoint.msg)
      else showUpdateForm(selectPoint.data)
    }

    if ($(e.target).hasClass('delete-point')) {
      const point_id = e.target.dataset.id
      deletePoint(point_id)
    }
  })

  async function postPoint(form_data) {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(form_data))
    }

    const posting = await fetch('/', options)
      .then((res) => res.json())
      .then((res) => res)

    if (posting.status !== 'ok') alert(posting.msg)
    else {
      alert(posting.msg)
      location.reload()
    }
  }

  function getPointById(point_id) {
    return fetch('/point/' + point_id, { method: 'GET' })
      .then((res) => res.json())
      .then((res) => res)
  }

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

    const updating = await fetch('/', options)
      .then((res) => res.json())
      .then((res) => res)

    if (updating.status === 'ok') {
      alert(updating.msg)
      location.reload()
    }
  }

  async function deletePoint(point_id) {
    const data = { id: point_id }
    const options = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }

    const deleting = await fetch('/', options)
      .then((res) => res.json())
      .then((res) => res)

    if (deleting.status === 'ok') {
      alert(deleting.msg)
      location.reload()
    }
  }
})


