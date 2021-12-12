import React from "react";
import { styled } from "@material-ui/core";
import { Facebook, Room, Phone, MailOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";


const Container = styled('div')(
  {
    display: 'flex',
    borderTop: '1px solid rgba(86, 141, 229, 1)',

    position: 'relative'

  }
)

const Left = styled('div')(
  {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px'
  }
)



const Logo = styled('h1')(
  {
    fontWeight: 'Bold',
    color: 'green',
  }
);

const Desc = styled('p')(
  {
    margin: '20px|0px'
  }
)


const SocialContainer = styled('div')(
  {
    display: 'flex'
  }
)

const SocialIcon = styled('div')(
  {
    width: '40px',
    height: '40px',
    color: 'white',
    borderRadius: '50%',
    backgroundColor: '#3B5999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '20px',

  }
)


const Center = styled('div')(
  {
    flex: 1,
    padding: '20px',
  }
)

const Title = styled('h3')(
  {
    marginBottom: '30px',
    color:'rgb(42, 128, 219)'
  }
)

const List = styled('ul')(
  {
    margin: 0,
    padding: 0,
    display: 'flex',
    flexWrap: 'wrap',
    listStyle: 'none'
  }
)



const ListItem = styled('li')(
  {
    width: '50%',
    marginBottom: '10px'
  }
)


const Right = styled('div')(
  {
    flex: 1,
    padding: '20px'
  }
)

const ContactItem = styled('div')(
  {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center'
  }
)


const Footer = () => {
  return (
    <Container>
      <Left>

        <Link style={{ textDecoration: "none" }} to="/">
          <img width='250px' style={{ paddingTop: '-10px' }} src="/imagebanner/logo_1.png" />
        </Link>
        <Desc>
          Web được phát triển bởi nhóm HKP-Học phần Công Nghệ Web-Đại học Sư Phạm TP.Hồ Chí Minh
        </Desc>
        <SocialContainer>
          <SocialIcon color="3B5999">
            <Facebook />
          </SocialIcon>

        </SocialContainer>
      </Left>
      <Center>
        <Title>Bạn đang cần</Title>
        <List>
          <ListItem>Trang chủ</ListItem>
          <ListItem>Trinh thám</ListItem>
          <ListItem>Sách mới</ListItem>
          <ListItem>Giỏ hàng</ListItem>
          <ListItem>Tài khoản</ListItem>
          <ListItem>Đơn hàng</ListItem>
        </List>
      </Center>
      <Right>
        <Title>Liên hệ</Title>
        <ContactItem>
          <Room style={{ marginRight: "10px" }} /> 280 An Dương Vương, Phường 4, Quận 5, TP.HCM
        </ContactItem>
        <ContactItem>
          <Phone style={{ marginRight: "10px" }} /> +1 234 56 78
        </ContactItem>
        <ContactItem>
          <MailOutline style={{ marginRight: "10px" }} /> abc@gmail.com
        </ContactItem>

      </Right>
    </Container>
  );
};

export default Footer;