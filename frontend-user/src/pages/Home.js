import React from "react";
import NavbarStore from "../components/NavbarStore";
import MenuStore from "../components/menu/MenuStore";
import BookList from "../components/book/BookList";
import Banner from "../components/banner/Banner";
import Footer from "../components/footer/Footer";
const Home = () => {
    return (
        <div>
            <Banner />
            <BookList />
        </div>
    )
}

export default Home;