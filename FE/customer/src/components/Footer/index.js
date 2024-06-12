import React from 'react'

const Footer = () => {
    return (
        <footer>
            <div class="footerContainer">
                <div class="socialIcons">
                    <a href=""><i class="fa-brands fa-facebook"></i></a>
                    <a href=""><i class="fa-brands fa-instagram"></i></a>
                    <a href=""><i class="fa-brands fa-twitter"></i></a>
                </div>
                <div class="footerNav">
                    <ul>
                        <li><a href="">HOME</a></li>
                        <li><a href="">ABOUT</a></li>
                        <li><a href="">CONTACT US</a></li>
                        <li><a href="">OUR TEAM</a></li>
                    </ul>
                </div>
            </div>
            <div class="footerBottom">
                <p>Copyright &copy;2024; Designed by <span class="designer">Team 4</span></p>
            </div>
        </footer>
    )
}

export default Footer
