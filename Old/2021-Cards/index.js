const projectsList = document.getElementById('projects_list');


onscroll = () => {
    projectsList.style.transform = `perspective(800px) translateY(${window.scrollY}px)`;
}