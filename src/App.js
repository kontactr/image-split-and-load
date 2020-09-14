import React from 'react';
import logo from './logo.svg';
import './App.css';
import CImage from './CImage';

class App extends React.Component {

  state = {
    fileObject: undefined,
    dataUrl: undefined
  }

  componentDidMount(){
    //alert("JSR")
    let canvas = document.getElementById("myCanvas")
    let imageRetriveCanvas = document.getElementById("getImage")
    this.setState({
      canvas,
      context: canvas ? canvas.getContext("2d") : undefined,
      imageRetriveCanvas,
      imageRetriveContext: imageRetriveCanvas ? imageRetriveCanvas.getContext("2d") : undefined,
    })
  }

  drawImage = async (newImage) => {
    const { height , width, image } = newImage
    const { context , canvas, imageRetriveCanvas, imageRetriveContext } = this.state
    if(context && canvas){
      canvas.setAttribute("height" , height)
      canvas.setAttribute("width" , width)
      context.drawImage(image , 0 ,0)

      const partNumber = 10

      let equalHeight = parseInt(height / partNumber)
      let remainingPart = height % partNumber

      if(imageRetriveCanvas && imageRetriveContext){
        
        

        imageRetriveCanvas.setAttribute("height" , equalHeight /* partNumber + remainingPart*/)
        imageRetriveCanvas.setAttribute("width" , width)

        const dataUrls = []
        

        const customFunction = async () => {
          for(let yPoint = 0 ; yPoint < partNumber ; yPoint+= 1){
            console.log(0 , width , equalHeight * yPoint , height)
            if(yPoint == partNumber - 1){
              
              let imageData = context.getImageData(0, yPoint * equalHeight ,width,equalHeight + remainingPart)
              imageRetriveCanvas.setAttribute("height" , equalHeight /** partNumber*/ + remainingPart)
              imageRetriveContext.putImageData(imageData , 0 , 0/*yPoint * equalHeight*/)    
            }else{
              console.log(48)
              let imageData = context.getImageData(0, yPoint * equalHeight ,width,equalHeight)
              imageRetriveContext.putImageData(imageData , 0 ,0/*yPoint * equalHeight*/)
            }
            
            
              dataUrls.push( this.canvasBlob( imageRetriveCanvas.toDataURL("image/jpeg" )) ) // change this format, if you want to manage image file's size
            
            //dataUrls.push(imageRetriveCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream"))
            await new Promise((res) => {

              setTimeout(() => {
                console.log("TICK")
                res();
              } , 500)
            })
          }
        }

       await customFunction()
      console.log(dataUrls)
      let counter = 0
      let blobUrls = []
        for(let blob of dataUrls){
          blobUrls.push(URL.createObjectURL(blob))
     //     this.downloadBase64File(base , "part"+(counter++))
           this.getDownloaded(blob , "part-"+(counter++))
        }       
        
        this.setState({
          renderUrls: blobUrls,
          renderAttributes: {
            height,
            width
          }
        })
        }
    }
  }



  canvasBlob = (dataURL) => {
    var data = atob( dataURL.substring( "data:image/jpeg;base64,".length ) ), // also change format
    asArray = new Uint8Array(data.length);

    for( var i = 0, len = data.length; i < len; ++i ) {
      asArray[i] = data.charCodeAt(i);    
    }

    var blob = new Blob( [ asArray.buffer ], {type: "image/jpeg"} ); // also change format
    return blob
  }

  getDownloaded = (blob , fileName) => {
    const blobUrl = URL.createObjectURL(blob);
    console.log(blobUrl , 100)
    var link = document.createElement("a"); // Or maybe get it from the current document
    link.href = blobUrl;
    link.download = fileName
    document.body.appendChild(link); // Or append it whereever you want
    link.click();
    window.URL.revokeObjectURL(blobUrl);
  }
  

  getImage = async (imageFile) => {
   return new Promise((res , rej) => {
      let fileReader = new FileReader()

      let fileUrl = window.URL.createObjectURL(imageFile)

    fileReader.onload = (e) => {
      let result = e.target.result
      let image = new Image()
      image.setAttribute('src' , result) // direct put fileUrl if you don't need fileReader
      image.onload = (e) => {
        let { path }  = e
        path = path[0]
        const width = path.width
        const height = path.height
        console.log(width, height , 33)  
        res({
          width,
          height,
          image
        })
      }
      image.onerror = (e) => {
        console.log(e)
        rej(e)
      }

    }
      fileReader.readAsDataURL(imageFile)

   })
  
  }

  render(){
    const { fileObject = undefined , renderUrls = [] , renderAttributes = {} } = this.state
    
  return (
    <div className="App">
      
      <canvas  id={"myCanvas"} >
      </canvas>
      <canvas id={"getImage"}></canvas>

      { (renderUrls && renderUrls.length) ? <CImage dataSources={renderUrls} renderAttributes={renderAttributes} ></CImage> : <></>}

      <input type="file" accept="image/*"  onChange={(e) => {
        let fileList = e.target.files
        if(fileList.length){
          console.log(fileList , 200)
          this.setState({
            fileObject: fileList[0]
          } ,async () => {
              const { fileObject } = this.state
              try{
                
                let newImage =  await this.getImage(fileObject)
                  this.drawImage(newImage)
                  console.log(5222)
              }catch(err){
                console.log(err , 4333)
              }
          } ) 
          
        }
      }} ></input>
    </div>
  );
  }
}

export default App;
