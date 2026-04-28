import numpy as np

def fitness(cycle, g, traffic):
    congestion = traffic / 40
    delay = (1 - (g / cycle))**2 + congestion**2
    return delay * 100


def optimize_traffic(cars):
    cycle = 120 if sum(cars) < 80 else 160

    best = None
    best_score = float("inf")

    for _ in range(200):
        g = np.random.randint(10, 60, 4)

        if sum(g) > cycle:
            continue

        score = sum(fitness(cycle, g[i], cars[i]) for i in range(4))

        if score < best_score:
            best_score = score
            best = g

    return {
        "north": int(best[0]),
        "south": int(best[1]),
        "west": int(best[2]),
        "east": int(best[3])
    }