$(document).ready(function() {
    // Initialisation d'EmailJS
    (function() {
        // Initialiser avec votre clé publique
        emailjs.init("s0Gx4g7xRm_hW6YFK");
    })();

    // Gestion du formulaire de contact
    $('#contact-form').on('submit', function(e) {
        e.preventDefault();
        
        var $submitBtn = $(this).find('button[type="submit"]');
        var originalText = $submitBtn.find('.button-inner').text();
        var $formStatus = $('#form-status');
        
        $submitBtn.find('.button-inner').text('Envoi en cours...').prop('disabled', true);
        
        // Préparation des paramètres pour EmailJS
        var templateParams = {
            name: $('#name').val(),
            email: $('#email').val(),
            subject: $('#subject').val(),
            message: $('#message').val()
        };
        
        // Envoi de l'email via EmailJS
        emailjs.send('service_f40sbkk', 'template_snk9j37', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                $('#contact-form')[0].reset();
                $submitBtn.find('.button-inner').text(originalText).prop('disabled', false);
                
                // Afficher un message de confirmation
                $formStatus.html('<div class="alert alert-success">Votre message a été envoyé avec succès!</div>');
                
                setTimeout(function() {
                    $formStatus.html('');
                }, 5000);
            }, function(error) {
                console.log('FAILED...', error);
                $submitBtn.find('.button-inner').text(originalText).prop('disabled', false);
                
                // Afficher un message d'erreur
                $formStatus.html('<div class="alert alert-danger">Une erreur est survenue. Veuillez réessayer.</div>');
            });
    });

    // Effet de scroll pour la navigation
    $(window).on("scroll", function() {
        if($(this).scrollTop() > 90) {
            $(".navbar").addClass("navbar-shrink");
        } else {
            $(".navbar").removeClass("navbar-shrink");
        }
    });

    // Initialisation de Parallax.js pour les formes flottantes
    function parallaxMouse() {
        if($("#parallax").length) {
            var scene = document.getElementById("parallax");
            var parallax = new Parallax(scene);
        }
    }

    parallaxMouse();

    // Gestion du menu mobile
    $(".navbar-toggler").on("click", function() {
        $(".navbar-collapse").toggleClass("show");
    });

    // Fermer le menu mobile quand un lien est cliqué
    $(".nav-link").on("click", function() {
        $(".navbar-collapse").removeClass("show");
    });

    // Animation améliorée de l'overlay d'intro
    setTimeout(function() {
        $(".intro-overlay").fadeOut(800);
    }, 3000);

    // Navigation active lors du scroll
    $(window).scroll(function() {
        var scrollDistance = $(window).scrollTop();
        
        // Pour chaque section, vérifie si elle est dans la vue
        $('section').each(function(i) {
            if ($(this).position().top - 200 <= scrollDistance) {
                $('.navbar .nav-item .nav-link.active').removeClass('active');
                $('.navbar .nav-item .nav-link').eq(i).addClass('active');
            }
        });
    }).scroll();

    // Défilement fluide pour les ancres
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = this.hash;
        var $target = $(target);
        var headerHeight = $('.navbar').outerHeight();
        
        $('html, body').animate({
            'scrollTop': $target.offset().top - headerHeight - 20
        }, 800, 'swing');
    });

    // Initialisation AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: false,
            mirror: false
        });
    }

    // Animation des statistiques
    function animateStats() {
        $('.stat-number').each(function() {
            var $this = $(this);
            var target = parseInt($this.text());
            $this.prop('Counter', 0).animate({
                Counter: target
            }, {
                duration: 2000,
                easing: 'swing',
                step: function(now) {
                    $this.text(Math.ceil(now));
                },
                complete: function() {
                    $this.text(target + '+');
                }
            });
        });
    }

    // Déclencher l'animation des statistiques quand la section devient visible
    $(window).on('scroll', function() {
        var statsOffset = $('.about-stats').offset();
        if (statsOffset) {
            var windowHeight = $(window).height();
            var windowScroll = $(this).scrollTop();
    
            if (windowScroll + windowHeight > statsOffset.top + 100) {
                animateStats();
                $(window).off('scroll'); // Ne déclencher qu'une seule fois
            }
        }
    });

    // Animation des éléments au survol
    $('.skill-card, .timeline-item, .formation-content, .certification-card, .project-content').hover(
        function() {
            $(this).css('transform', 'translateY(-10px)');
        },
        function() {
            $(this).css('transform', 'translateY(0)');
        }
    );

    // Animation des logos dans la section brands - Amélioré pour préserver les proportions
    $('.carouselTrack').css('animation-play-state', 'running');
    
    $('.brandsCarousel').hover(
        function() {
            $('.carouselTrack').css('animation-play-state', 'paused');
        },
        function() {
            $('.carouselTrack').css('animation-play-state', 'running');
        }
    );

    // Chargement correct des images du carousel
    $('.brandLogo img').each(function() {
        var img = $(this);
        
        // Préchargement des images pour maintenir les proportions
        if (img.attr('src')) {
            var tempImg = new Image();
            tempImg.onload = function() {
                // Assurer que les images gardent leur ratio
                img.css({
                    'max-width': '100%',
                    'max-height': '100%',
                    'object-fit': 'contain'
                });
            };
            tempImg.src = img.attr('src');
        }
        
        // Pour les images avec data-src (lazy loading)
        if (img.attr('data-src')) {
            img.attr('src', img.attr('data-src'));
            img.removeAttr('data-src');
        }
    });

    // Gestion du slider de projets
    var currentSlide = 0;
    var slideCount = $('.project-slide').length;
    
    // Initialiser les slides avec une position de départ
    $('.project-slide').each(function(index) {
        $(this).css('--order', index);
        if (index > 0) {
            $(this).css('transform', 'translateX(100%)');
        }
    });
    
    // Fonction pour afficher une slide spécifique
    function showSlide(index) {
        $('.project-slide').css('transform', 'translateX(100%)');
        $('.project-slide').eq(index).css('transform', 'translateX(0)');
        $('.project-dot').removeClass('active');
        $('.project-dot[data-index="' + index + '"]').addClass('active');
        currentSlide = index;
    }
    
    // Navigation suivant/précédent
    $('.next-btn').on('click', function() {
        var nextSlide = (currentSlide + 1) % slideCount;
        showSlide(nextSlide);
    });
    
    $('.prev-btn').on('click', function() {
        var prevSlide = (currentSlide - 1 + slideCount) % slideCount;
        showSlide(prevSlide);
    });
    
    // Navigation par points
    $('.project-dot').on('click', function() {
        var index = $(this).data('index');
        showSlide(index);
    });

    // Filtrage des projets showcase
    $('.showcase-filter-btn').on('click', function() {
        var filter = $(this).data('filter');
        
        $('.showcase-filter-btn').removeClass('active');
        $(this).addClass('active');
        
        if (filter === 'all') {
            $('.showcase-item').show();
        } else {
            $('.showcase-item').hide();
            $('.showcase-item[data-category="' + filter + '"]').show();
        }
    });

    // Effet de hover sur les icônes de compétences
    $('.skill-icon').hover(
        function() {
            $(this).css({
                'transform': 'scale(1.2) rotate(10deg)',
                'color': '#f67280' // Couleur secondaire au survol
            });
        },
        function() {
            $(this).css({
                'transform': 'scale(1) rotate(0)',
                'color': '' // Retour à la couleur par défaut
            });
        }
    );

    // Animation du texte sur la page d'accueil 
    const textLines = document.querySelectorAll('.text-line');
    
    // Si l'animation CSS ne fonctionne pas correctement, activer cette fonction alternative
    function rotateText() {
        // Masquer tous les textes
        textLines.forEach(line => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(20px)';
        });
        
        // Afficher le texte courant
        textLines[currentTextIndex].style.opacity = '1';
        textLines[currentTextIndex].style.transform = 'translateY(0)';
        
        // Passer au texte suivant
        currentTextIndex = (currentTextIndex + 1) % textLines.length;
    }
    
    // Décommenter cette ligne si l'animation CSS ne fonctionne pas
    // let currentTextIndex = 0;
    // setInterval(rotateText, 2500);

    // Initialisation de ScrollIt si disponible
    if(typeof $.scrollIt === 'function') {
        $.scrollIt({
            upKey: 38,
            downKey: 40,
            easing: 'linear',
            scrollTime: 600,
            activeClass: 'active',
            onPageChange: null,
            topOffset: -100
        });
    }
    
    // Gestion d'erreurs potentielles avec les images
    $('img').on('error', function() {
        $(this).attr('src', 'placeholder.svg'); // Remplacer par une image par défaut
    });
    
    // Optimiser le chargement des images
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px 200px 0px'
        };
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        image.src = image.dataset.src;
                        image.onload = () => image.removeAttribute('data-src');
                        imageObserver.unobserve(image);
                    }
                });
            }, options);
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.onload = () => img.removeAttribute('data-src');
            });
        }
    }
    
    lazyLoadImages();

    // Amélioration du comportement sur mobile
    // Fermer le menu lorsqu'on clique n'importe où sur la page sur mobile
    $(document).on('click', function(e) {
        if($('.navbar-collapse').hasClass('show') && 
           !$(e.target).closest('.navbar-collapse').length && 
           !$(e.target).closest('.navbar-toggler').length) {
            $('.navbar-collapse').removeClass('show');
        }
    });
    
    // Ajuster la hauteur de la page d'accueil sur mobile
    function adjustHeight() {
        if ($(window).width() < 768) {
            var windowHeight = $(window).height();
            $('.header-content').css('height', windowHeight + 'px');
        } else {
            $('.header-content').css('height', '800px');
        }
    }
    
    adjustHeight();
    $(window).resize(adjustHeight);
    
    // Améliorer le chargement des images
    $('img').each(function() {
        if (!this.complete) {
            $(this).on('error', function() {
                $(this).attr('src', 'placeholder.svg');
            });
        }
    });
});
