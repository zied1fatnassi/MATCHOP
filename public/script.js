// Add subtle animation effects
document.addEventListener('DOMContentLoaded', function() {
  const logoIcon = document.querySelector('.logo-icon');
  const shapes = document.querySelectorAll('.shape');
  const diamond = document.querySelector('.diamond');
  
  // Add hover effect to logo icon
  logoIcon.addEventListener('mouseenter', function() {
    shapes.forEach((shape, index) => {
      shape.style.transition = 'transform 0.3s ease';
      shape.style.transform += ' scale(1.05)';
    });
    
    diamond.style.transition = 'transform 0.3s ease';
    diamond.style.transform += ' scale(1.1)';
  });
  
  logoIcon.addEventListener('mouseleave', function() {
    shapes.forEach((shape, index) => {
      shape.style.transform = shape.style.transform.replace(' scale(1.05)', '');
    });
    
    diamond.style.transform = diamond.style.transform.replace(' scale(1.1)', '');
  });
  
  // Add subtle floating animation
  function addFloatingAnimation() {
    const keyframes = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
      }
    `;
    
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    
    logoIcon.style.animation = 'float 3s ease-in-out infinite';
  }
  
  // Initialize floating animation after a short delay
  setTimeout(addFloatingAnimation, 1000);
});
