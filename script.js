function photosList() {
  return {
    loading: false,
    photos: [],
    date: '2015-06-30',
    rovers: ['curiosity', 'opportunity'],
    /**
     * @link https://github.com/chrisccerami/mars-photo-api
     * @param rover
     * @param date
     * @returns {string}
     */
    getRoverPhotosUrl(rover, date) {
      return `https://mars-photos.herokuapp.com/api/v1/rovers/${rover}/photos?earth_date=${date}`
    },
    async fetchData(date) {
      try {
        this.loading = true

        const results = await Promise.all(
          this.rovers.map(rover =>
            fetch(this.getRoverPhotosUrl(rover, date))
              .then(r => r.ok ? r.json() : Promise.reject(r.statusText || 'Smth wrong'))
          )
        )
        this.photos = this.orderData(this.transformData(this.mergeData(results)))
      } catch (e) {
        alert(`Error: ${e.toString()}`)
      } finally {
        this.loading = false
      }
    },
    /**
     * [{"photos":[item1]},{"photos":[item2]}] -> [item1, item2]
     * @param results
     * @returns {*}
     */
    mergeData(results) {
      return results.reduce((prev, curr) => {
        prev = [...prev, ...curr.photos]
        return prev
      }, [])
    },
    transformData(photos) {
      return photos.map(photo => {
        const date = new Date(photo.earth_date)

        let caption = ''
        caption += `${photo.id} `
        caption += `${photo.rover.name}(${photo.camera.full_name}) `
        caption += `${date.toLocaleDateString()} `

        return {
          ...photo,
          unixTime: +date,
          caption,
          img_src: photo.img_src.replace('http://', 'https://'),
        }})
    },
    orderData(photos) {
      return photos.sort((a, b) => a.id - b.id)
    }
  }
}
