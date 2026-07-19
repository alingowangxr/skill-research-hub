import unittest

from app.api.trending import _revival_velocity


class RevivalVelocityTest(unittest.TestCase):
    def test_uses_each_skill_star_count(self):
        low_base = {"delta": 3, "stars": 2}
        high_base = {"delta": 10, "stars": 99}

        ranked = sorted(
            [high_base, low_base],
            key=_revival_velocity,
            reverse=True,
        )

        self.assertIs(ranked[0], low_base)

    def test_handles_missing_or_negative_stars(self):
        self.assertEqual(_revival_velocity({"delta": 2}), 2)
        self.assertEqual(_revival_velocity({"delta": 2, "stars": -1}), 2)


if __name__ == "__main__":
    unittest.main()
