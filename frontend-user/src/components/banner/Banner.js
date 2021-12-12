import React from "react";
import { Box, styled } from "@material-ui/core";
import { ImageList,ImageListItem } from "@material-ui/core";
import { Link } from "react-router-dom";
const itemData = [
    {
      id:40,
      img:'/imagebanner/SCDNL.jpg',
     
      cols:4
    },
    {
        id:41,
      img: '/imagebanner/LDTCKCD.jpg',
     
      cols:2
    },
    {
        id:14,
      img: '/imagebanner/AAKH.jpg',
      
      cols:2
    },
    {
    id:42,
    img: '/imagebanner/LQNH.jpg',
    cols:2
  },
  {
      id:37,
    img: '/imagebanner/NKTT.jpg',
   
    cols:2
  }
  ,
  
]
const CImage = styled('div')(
    {
        padding:10,
        marginTop:'-10px',
        marginLeft: '25.5ch',
        height: '64.7ch',

    }
)

const Banner = () => {
    return (
        <CImage >
            <ImageList rowHeight={182.5} cols={4} >
              
                {itemData.map((item, index) => (
                
                    <ImageListItem key={index} cols={item.cols || 1} style={{ loading: "lazy", }}>
                        <Link to={`/book?id=${item.id}`}>
                        <img alt="" style={{height:'100%',width:'100%',magrinLeft:'1110px'}} src={item.img} />
                        </Link>
                    </ImageListItem>
                   
                ))}
            </ImageList>
        </CImage>
    )
}
export default Banner;