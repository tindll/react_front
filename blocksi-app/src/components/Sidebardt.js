import {Modal} from 'bootstrap';
import React from 'react'
import * as iconsCG from 'react-icons/cg'

function openModal() {
    var modalToggle = document.getElementById('exampleModal');
    var x = Modal.getOrCreateInstance(modalToggle);
    x.show();
}
function logout() {
    document.cookie = "jwtAuth="; 
    window.location.reload();
}

export const Sidebardt = [
    {
        title: 'Add Contact',
        path: '',
        click: openModal,
        icon: <iconsCG.CgMathPlus/>,
        classN: 'nav-text'
    },
    {
        title: 'Contact List',
        path: '',
        icon: <iconsCG.CgList/>,
        classN: 'nav-text'
    },
    {
        title: 'Log out',
        path: '',
        click: logout,
        icon: <iconsCG.CgLock/>,
        classN: 'nav-text'
    }

]
