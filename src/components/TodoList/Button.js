import React from 'react'
import styled from 'styled-components'

// const Button = styled.div`
//   .btn-black {
//     background-color: black;
//     color: #eee;
//   }

//   .btn-black::after {
//     background-color: black;
//   }

//   // .btn:hover {
//   //   background-color: black;
//   // }

//   .btn::after {
//     content: '';
//     // background-color: white;
//     display: inline-block;
//     width: 100%;
//     height: 100%;
//     border-radius: 50%;
//     position: absolute;
//     top: 0;
//     left: 0;
//     z-index: -1;
//     transition: all .4s;
//   }

//   .btn:link, .btn:visited {
//     text-decoration: none;
//     display: inline-block;
//     border-radius: 50%;
//     padding: 4px;
//     transition: 0.3s;
//     position: absolute;
//   }

//   .btn:hover::after {
//     transform: scale(1.5);
//     opacity: 0;
//   }

//   .btn-animation {
//     animation: animateButton 3s ease-out;
//     animation-fill-mode: backwards;
//   }

//   @keyframes animateButton {
//     0% {
//       opacity: 0;
//       transform: translateY(32px);
//     }
//     100% {
//       opacity: 1;
//       transform: translateY(0px);
//     }
//   }

//   // transition
//   -webkit-transition: all 0.5s 0s ease;
//   -moz-transition: all 0.5s 0s ease;
//   -o-transition: all 0.5s 0s ease;
//   transition: all 0.5s 0s ease;

//   // Remove the complete styling of an HTML button/submit
//   // background: none;
//   // color: inherit;
//   // border: none;
//   // padding: 0;
//   // font: inherit;
//   // cursor: pointer;
//   // outline: inherit;
//   // Remove the complete styling of an HTML button/submit
// `

const Button = styled.div`
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-flex-wrap: nowrap;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-align-content: stretch;
  -ms-flex-line-pack: stretch;
  align-content: stretch;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;

  width: 32px;
  height: 32px;
  background-color: #5c677d;
  trasition: all 0.4s;
  border-radius: 50%;

  :hover {
    background-color: #7d8597;
  }
`

function ButtonComponent(props) {
  return (
    <Button {...props}>
      {props.children}
    </Button>
  )
}

export default ButtonComponent

