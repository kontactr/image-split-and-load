import React from 'react'
import WebWorker from './WebWorker';
import imageWorker from './WorkerScript.worker.js'

export default class CImage extends React.Component{

    componentDidMount(){
        const { dataSources = [], renderAttributes = {}  } = this.props
        if(!dataSources.length){
            return
        }
        if(this.canvasImage){
             let context = this.canvasImage.getContext('2d')
             let totalHeight = renderAttributes.height
             let totalWidth = renderAttributes.width

             let equalHeight = parseInt(totalHeight / Math.max(dataSources.length || 0 , 1))
             let remainingPart = totalHeight % Math.max(dataSources.length || 0 , 1 )

             if(false && window.Worker){ 
                let dataSourcesLength = dataSources.length
                let totalParts = 2
                
                let arrayOfWorkers =  this.generateWorkers(totalParts)
                let partedSources = this.partDataSources(dataSources , totalParts)

                console.log(arrayOfWorkers, dataSources , 21)

                for(let iworker = 0 ;  iworker < arrayOfWorkers.length ;  iworker++){
                    arrayOfWorkers[iworker].onmessage = (e) => {
                        console.log(e , 2555)
                    }
                    arrayOfWorkers[iworker].postMessage(partedSources[iworker])
                    //iworker.postMessage(  )
                }
             }else{
                
                let allPartsPromise = (dataSources || []).map((url , index) => {
                    new Promise((res , rej) => {
                        let newImage = new Image()
                        newImage.setAttribute("src" , url)
                        newImage.onload = async () => {
                            
                            setTimeout(() => {
                                if(index == dataSources.length - 1){
                                    context.drawImage(newImage , 0 , index * equalHeight )    
                                }else{
                                    context.drawImage(newImage , 0 , index * equalHeight)    
                                }
                                res()
                            } , parseInt(Math.random() * 3000 ))
                        }
                        newImage.onerror = () => {
                            rej()
                        }
                    })
                })

             }
        }
    }

    determineSize = () => {

    }

    render(){
        const { dataSources, renderAttributes , ...rest } = this.props
        const { height , width } = renderAttributes
        return <canvas {...rest} height={height} width={width} ref={(canvasImage) => {
            this.canvasImage = canvasImage
        }}></canvas>
    }

    partDataSources = (sources , totalParts) => {
        let mainArray = []
        let target = []
        let equalParts = Math.round( (sources.length || 0) / totalParts)
        for (let element of sources){
            if(target.length < equalParts){
                target.push(element)
            }else if(target.length === equalParts){
                mainArray.push(target)
                target = [element]
            }
        }
        if(target.length){
            mainArray.push(target)
            target = []
        }
        return mainArray
    }

    generateWorkers = (howmany) => {
        let temp = []
        for(let i = 0 ; i < howmany ; i++){
            temp.push( new WebWorker(imageWorker) )
        }
        return temp
    }

}