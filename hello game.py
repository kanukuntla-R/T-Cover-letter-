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
rotation_speed = 2

# Ball parameters
ball_radius = 10
g = 0.2  # Gravity
velocity = 0  # Ball rolling velocity
ball_angle = 0  # Angle around the hexagon
ball_distance = hex_radius - 10  # Ball stays inside the hexagon

clock = pygame.time.Clock()
running = True

while running:
    screen.fill(BLACK)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    
    # Rotate hexagon
    rotation_angle += rotation_speed
    
    # Simulate ball movement inside the hexagon (rolling effect)
    velocity += g
    ball_angle += velocity  # Ball rolls along the hexagon walls
    
    # Keep the ball confined within the hexagon
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
