"""
Functionalities for running async functions in a thread.
"""

import asyncio


def between_callback(func, args) -> None:
    """
    An interface between the async and synchronous functions.
    """
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(func(args))
    loop.close()
