export default () => {
    self.addEventListener('message' , e => { // eslint-disable-line no-restricted-globals
        
        const imageUrl = e.data[0]
        /*fetch(imageUrl).then((resp) => {
            console.log(resp , 6666)
            return resp.blob()
        }).then((resp)=> {
            let q = new Image()

        })*/
    })
} 