"""
File for tracking the progress of a user in a given key.
"""


class ProgressTracker:

    """
    Class implements functions to track the progress of a user in a given key.
    """

    def __init__(self):
        self.data: dict[str, float] = {}

    def update_key_progress(self, user_id: str, progress: float) -> None:
        """
        Updates the progress of a user in a given key.

        Args:
            user_id: The user ID of the user to update progress for.
            progress: The progress to update to. Must be between 0 and 1.

        Raises:
            AssertionError: If progress is not between 0 and 1.
        """
        assert 0 <= progress <= 1, "Progress must be between 0 and 1"
        self.data[user_id] = progress

    def get_key_progress(self, user_id: str) -> float:
        """
        Get the progress of a user in a given key.

        Args:
            user_id: The user ID of the user to get progress for.

        Returns:
            The progress of the user in the given key. If the user has no progress, returns -1.
        """
        return self.data.get(user_id, -1)

    def delete_key_progress(self, user_id: str) -> None:
        """
        Removes the progress of a user in a given key if the key exists

        Args:
            user_id: The user ID of the user to delete progress for.
        """
        if user_id in self.data:
            del self.data[user_id]
