import numpy as np
import random

class TrafficRL:
    def __init__(self):
        self.q_table = {}  # simple Q-learning

        self.actions = [
            [40, 20, 20, 20],
            [20, 40, 20, 20],
            [20, 20, 40, 20],
            [20, 20, 20, 40]
        ]

        self.alpha = 0.1
        self.gamma = 0.9
        self.epsilon = 0.2

    def get_state(self, cars):
        return tuple(cars)

    def choose_action(self, state):
        if random.random() < self.epsilon:
            return random.randint(0, len(self.actions)-1)

        if state not in self.q_table:
            self.q_table[state] = [0]*len(self.actions)

        return int(np.argmax(self.q_table[state]))

    def reward(self, cars, action):
        # minimize waiting
        return -sum(cars)

    def train(self, cars):
        state = self.get_state(cars)

        action = self.choose_action(state)
        reward = self.reward(cars, action)

        if state not in self.q_table:
            self.q_table[state] = [0]*len(self.actions)

        self.q_table[state][action] += self.alpha * (
            reward - self.q_table[state][action]
        )

        return self.actions[action]


rl_agent = TrafficRL()


def optimize_with_rl(cars):
    return rl_agent.train(cars)