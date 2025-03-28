$(document).ready(function() {
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
        
        // Tenir compte de la hauteur de la navbar
        var navHeight = $('.navbar').outerHeight();
        // Ajuster le décalage en fonction du dispositif (mobile ou desktop)
        var offset = window.innerWidth <= 768 ? navHeight + 30 : navHeight;
        
        $('html, body').animate({
            'scrollTop': $target.offset().top - offset
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

    // Gestion du formulaire de contact avec EmailJS
    $('#contact-form').on('submit', function(e) {
        e.preventDefault();
        
        var $submitBtn = $(this).find('button[type="submit"]');
        var originalText = $submitBtn.text();
        
        $submitBtn.text('Envoi en cours...').prop('disabled', true);
        
        // Récupération des données du formulaire
        var formData = {
            from_name: $('#name').val(),
            reply_to: $('#email').val(),
            subject: $('#subject').val(),
            message: $('#message').val()
        };
        
        // Envoi du message via EmailJS
        emailjs.send('service_f40sbkk', 'template_snk9j37', formData)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Réinitialiser le formulaire
                $('#contact-form')[0].reset();
                $submitBtn.text(originalText).prop('disabled', false);
                
                // Afficher un message de confirmation
                var confirmationMsg = $('<div class="alert alert-success mt-3">Votre message a été envoyé avec succès!</div>');
                $('#contact-form').append(confirmationMsg);
                
                setTimeout(function() {
                    confirmationMsg.fadeOut(function() {
                        $(this).remove();
                    });
                }, 3000);
            }, function(error) {
                console.log('FAILED...', error);
                
                // Réactiver le bouton
                $submitBtn.text(originalText).prop('disabled', false);
                
                // Afficher un message d'erreur
                var errorMsg = $('<div class="alert alert-danger mt-3">L\'envoi a échoué. Veuillez réessayer.</div>');
                $('#contact-form').append(errorMsg);
                
                setTimeout(function() {
                    errorMsg.fadeOut(function() {
                        $(this).remove();
                    });
                }, 3000);
            });
    });

    // Pour les carrousels et lightbox (si vous ajoutez des galeries)
    if(typeof $.fn.owlCarousel !== 'undefined') {
        $(".owl-carousel").owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            nav: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            dots: true
        });
    }
    
    if(typeof $.fn.magnificPopup !== 'undefined') {
        $('.image-popup').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    }

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

    // Optimisations pour les appareils mobiles SEULEMENT
    function mobileOptimizations() {
        if (window.innerWidth <= 991) {
            // Amélioration du bouton hamburger sur mobile
            if (!$('.navbar-toggler').hasClass('mobile-enhanced')) {
                $('.navbar-toggler').addClass('mobile-enhanced').css({
                    'display': 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    'height': '40px',
                    'width': '50px',
                    'font-size': '20px'
                });
            }
            
            // Amélioration de l'image principale sur mobile
            $('.home-img img').css({
                'border-radius': '15px',
                'box-shadow': '0 10px 30px rgba(0, 0, 0, 0.1)',
                'max-width': '75%',
                'margin': '0 auto'
            });
            
            // Amélioration des icônes sociales sur mobile
            $('.header-social-icon ul li a').css({
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center',
                'width': '45px',
                'height': '45px',
                'line-height': '1'
            });
            
            // Centre le texte et les boutons sur mobile
            $('.home-text').css('text-align', 'center');
            $('.home-btn').css({
                'display': 'flex',
                'justify-content': 'center'
            });
        } else {
            // Réinitialisation pour desktop
            if ($('.navbar-toggler').hasClass('mobile-enhanced')) {
                $('.navbar-toggler').removeClass('mobile-enhanced').css({
                    'display': '',
                    'align-items': '',
                    'justify-content': '',
                    'height': '',
                    'width': '',
                    'font-size': ''
                });
            }
            
            // Réinitialisation de l'image principale
            $('.home-img img').css({
                'border-radius': '',
                'box-shadow': '',
                'max-width': '',
                'margin': ''
            });
            
            // Réinitialisation des icônes sociales
            $('.header-social-icon ul li a').css({
                'display': '',
                'align-items': '',
                'justify-content': '',
                'width': '',
                'height': '',
                'line-height': ''
            });
            
            // Réinitialisation du texte et des boutons
            $('.home-text').css('text-align', '');
            $('.home-btn').css({
                'display': '',
                'justify-content': ''
            });
        }
    }
    
    // Appliquer les optimisations au chargement et au redimensionnement
    mobileOptimizations();
    $(window).on('resize', mobileOptimizations);
    
    // Gestion d'erreurs potentielles avec les images
    $('img').on('error', function() {
        $(this).attr('src', 'placeholder.svg'); // Remplacer par une image par défaut
    });
});
