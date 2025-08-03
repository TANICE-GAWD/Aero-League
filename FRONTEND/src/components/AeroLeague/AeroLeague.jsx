import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframes for the shimmering animation
const shimmer = keyframes`
  0% {
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #0ff;
  }
  50% {
    text-shadow: 0 0 20px #fff, 0 0 30px #0ff, 0 0 40px #0ff;
  }
  100% {
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #0ff;
  }
`;

// Styled container for the animation
const AnimatedTextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #000322;
  text-align: center;
  font-family: 'Courgette', cursive;
  color: #fff;
  font-size: 5vw; // Responsive font size
  white-space: pre-wrap; // To respect the newlines in the text
  animation: ${shimmer} 2s infinite;

  @media (max-width: 768px) {
    font-size: 8vw;
  }
`;

const ParticleText = () => {
  const text = "HEYA,\nANADI SHARMA\nHERE";
  return (
    <AnimatedTextContainer>
      {text}
    </AnimatedTextContainer>
  );
};

export default ParticleText;