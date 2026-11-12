"""Where the API keys live. Keys are never written to a file in this project,
never put in the config, never printed, and never sent through the chat.

Order of lookup for a provider's key (first hit wins):
  1. the operating system's own secret store (Windows Credential Manager,
     macOS Keychain, Linux Secret Service), through the `keyring` package;
  2. an environment variable, if the config names one;
  3. "proxy": the session's network proxy adds the real key to the request
     (used in cloud sessions). The bridge then sends a harmless placeholder.
"""
import os

SERVICE = "ar-model-bridge"
PLACEHOLDER = "proxy-managed-placeholder"


def _keyring():
    try:
        import keyring  # noqa: WPS433
        return keyring
    except Exception:
        return None


def backend_info():
    """(name, ok, note) for the keyring backend in use."""
    kr = _keyring()
    if kr is None:
        return ("none", False, "the `keyring` package is not installed (pip install keyring)")
    try:
        be = kr.get_keyring()
    except Exception as e:  # pragma: no cover
        return ("error", False, str(e))
    name = type(be).__module__ + "." + type(be).__name__
    low = name.lower()
    if "fail" in low or "null" in low:
        return (name, False, "no secure store is available on this computer")
    if "plaintext" in low or "alt" in low.split(".")[:2]:
        return (name, False, "this backend stores keys as plain text; do not use it")
    return (name, True, "ok")


def get_secret(spec):
    """spec: {"keyring": "name", "env": "VAR", "proxy": true}. Returns (value, source)."""
    spec = spec or {}
    kr = _keyring()
    if kr and spec.get("keyring"):
        try:
            v = kr.get_password(SERVICE, spec["keyring"])
        except Exception:
            v = None
        if v:
            return v, "keyring"
    if spec.get("env"):
        v = os.environ.get(spec["env"])
        if v:
            return v, "env"
    if spec.get("proxy"):
        return PLACEHOLDER, "proxy"
    return None, None


def set_secret(name, value):
    kr = _keyring()
    ok, note = backend_info()[1:]
    if kr is None or not ok:
        raise RuntimeError("Cannot store the key safely: " + note)
    kr.set_password(SERVICE, name, value)


def delete_secret(name):
    kr = _keyring()
    if kr is None:
        raise RuntimeError("the `keyring` package is not installed")
    try:
        kr.delete_password(SERVICE, name)
        return True
    except Exception:
        return False
