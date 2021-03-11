export function mapToClass(index: number): string {
    switch (index) {
        case 0:
            return 'Caraway'
        case 1:
            return 'Holy Basil'
        case 2:
            return 'Papermint'
        case 3:
            return 'Sweet Basil'
        default:
            return 'Unkown';
    }
}

export function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}