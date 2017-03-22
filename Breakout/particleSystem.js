function ParticleSystem(spec, graphics){
    let that = {};
    let particles = [];
    let imageSrc = spec.image;
    spec.image = new Image();

    spec.image.onload = function() {
		that.render = function() {
			for (let i = 0; i < particles.length; i++) {
				graphics.drawTexture(particles[i]);
			}
		};
	};
	spec.image.src = imageSrc;

    that.create = function(center){
        let p = {
            image: spec.image,
            size: Math.random() * 25 + 25,
            center: {x: center.x, y: center.y},
            speed: {x: Math.random() * 3 - Math.random() * 3 , y: Math.random() * 3 - Math.random() * 3},
            rotation: 0,
            lifetime: Math.random() * 2 + 1,
            alive: 0
        };
		particles.push(p);
    };

    that.update = function(elapsedTime){
        for(let i = 0; i < particles.length; i++){
            particles[i].alive += elapsedTime;
            particles[i].center.x += particles[i].speed.x;
            particles[i].center.y += particles[i].speed.y;
            particles[i].rotation += Math.random() / 2;
            if(particles[i].alive > particles[i].lifetime){
                particles.splice(i, 1);
                i--;
            }
        }
    };

    that.render = function(){
    };

    return that;
}