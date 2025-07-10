function truncate(str, maxLength) {
    if (str.length > maxLength) {
        return str.substr(0, maxLength - 1) + '...'
    }
        return str
}