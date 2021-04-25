export function mapToClass(index: number): string {
    switch (index) {
        case 0:
            return 'ยี่หร่า'
        case 1:
            return 'กะเพรา'
        case 2:
            return 'สะระแหน่'
        case 3:
            return 'โหระพา'
        default:
            return 'ไม่อยู่ในกลุ่มไหนเลย';
    }
}

export function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}