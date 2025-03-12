import pygame
import math

# Initialize pygame
pygame.init()

# Screen dimensions
WIDTH, HEIGHT = 600, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Ball in Rotating Hexagon")

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)

# Hexagon parameters
hex_radius = 150
hex_center = (WIDTH // 2, HEIGHT // 2)
rotation_angle = 0

# Ball parameters
ball_radius = 10
g = 0.5  # Gravity
velocity = 0  # Ball velocity
ball_angle = 0  # Angle of ball movement
ball_distance = hex_radius - 10  # Distance from center

clock = pygame.time.Clock()
running = True

while running:
    screen.fill(BLACK)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    
    # Rotate hexagon
    rotation_angle += 2  # Change rotation speed here
    
    # Move the ball inside the hexagon
    velocity += g
    ball_distance -= velocity
    if ball_distance <= hex_radius - 10:
        velocity *= -0.8  # Bounce effect
    
    ball_x = hex_center[0] + ball_distance * math.cos(math.radians(ball_angle))
    ball_y = hex_center[1] + ball_distance * math.sin(math.radians(ball_angle))
    
    # Draw rotating hexagon
    points = []
    for i in range(6):
        angle = math.radians(i * 60 + rotation_angle)
        x = hex_center[0] + hex_radius * math.cos(angle)
        y = hex_center[1] + hex_radius * math.sin(angle)
        points.append((x, y))
    pygame.draw.polygon(screen, WHITE, points, 2)
    
    # Draw ball
    pygame.draw.circle(screen, RED, (int(ball_x), int(ball_y)), ball_radius)
    
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
