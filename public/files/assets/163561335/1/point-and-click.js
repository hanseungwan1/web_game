var PointAndClick = pc.createScript('pointAndClick');

PointAndClick.attributes.add('cameraEntity', {type: 'entity', title: 'Camera Entity'});
PointAndClick.attributes.add('playerEntity', {type: 'entity', title: 'Player Entity'});
PointAndClick.attributes.add('playerSpeed', {type: 'number', default: 0, title: 'Player Speed'});

// initialize code called once per entity
PointAndClick.prototype.initialize = function() {
    this.groundShape = new pc.BoundingBox(new pc.Vec3(0, 0, 0), new pc.Vec3(4, 0.001, 4));
    this.direction = new pc.Vec3();
    this.distanceToTravel = 0;
    this.targetPosition = new pc.Vec3();
    
    // Register the mouse down and touch start event so we know when the user has clicked
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    
    // 앱 일 경우 (앱 터치 )
    if (this.app.touch) {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
    }
    
    // 파일이 다운이 될때 off 시켜준다.
    this.on('destroy', function() {
        // Register the mouse down and touch start event so we know when the user has clicked
        this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);

        if (this.app.touch) {
            this.app.touch.off(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        }     
    }, this);
};


PointAndClick.newPosition = new pc.Vec3();

// update code called every frame
PointAndClick.prototype.update = function(dt) {
    if (this.direction.lengthSq() > 0) {
        // Move in the direction at a set speed
        var d = this.playerSpeed * dt;
        var newPosition = PointAndClick.newPosition;
       
        newPosition.copy(this.direction).scale(d);
        newPosition.add(this.playerEntity.getPosition());        
        this.playerEntity.rigidbody.teleport(newPosition);     
        
        this.distanceToTravel -= d;
        
        // If we have reached our destination, clamp the position 
        // and reset the direction
        if (this.distanceToTravel <= 0) {
            this.playerEntity.rigidbody.teleport(this.targetPosition);
            this.direction.set(0, 0, 0);
        }
    }
};


PointAndClick.prototype.movePlayerTo = function (worldPosition) {
    this.targetPosition.copy(worldPosition);
        
    // Assuming we are travelling on a flat, horizontal surface, we make the Y the same
    // as the player
    this.targetPosition.y = this.playerEntity.getPosition().y;

    this.distanceTravelled = 0;
    
    // Work out the direction that the player needs to travel in
    this.direction.sub2(this.targetPosition, this.playerEntity.getPosition());
    
    // Get the distance the player needs to travel for
    this.distanceToTravel = this.direction.length();
    
    if (this.distanceToTravel > 0) {
        // Ensure the direction is a unit vector
        this.direction.normalize();

        this.playerEntity.lookAt(this.targetPosition);
    } else {
        this.direction.set(0, 0, 0);
    }
};


PointAndClick.prototype.onMouseDown = function(event) {
    if (event.button == pc.MOUSEBUTTON_LEFT) {
        this.doRayCast(event);
    }
};


PointAndClick.prototype.onTouchStart = function (event) {
    // On perform the raycast logic if the user has one finger on the screen
    if (event.touches.length == 1) {
        this.doRayCast(event.touches[0]);
        event.event.preventDefault();
    }    
};


PointAndClick.ray = new pc.Ray();
PointAndClick.hitPosition = new pc.Vec3();

PointAndClick.prototype.doRayCast = function (screenPosition) {
    // Initialise the ray and work out the direction of the ray from the a screen position
    var ray = PointAndClick.ray;
    var hitPosition = PointAndClick.hitPosition;

    this.cameraEntity.camera.screenToWorld(screenPosition.x, screenPosition.y, this.cameraEntity.camera.nearClip, ray.origin); 
    this.cameraEntity.camera.screenToWorld(screenPosition.x, screenPosition.y, this.cameraEntity.camera.farClip, ray.direction); 
    // normalize 작업
    ray.direction.sub(ray.origin).normalize();
    
    // Test the ray against the ground
    var result = this.groundShape.intersectsRay(ray, hitPosition);  
    if (result) {
        this.movePlayerTo(hitPosition);
    }  
};