import { grey, green, blue, red, orange } from '@ant-design/colors';

export function colorMethod(method) {
    switch (method) {
        case "POST":
            return green[6]
        case "PUT":
            return orange[6]
        case "GET":
            return blue[6]
        case "DELETE":
            return red[6]
        case "IMPORT":
            return '#2ecc71'
        case "EXPORT":
            return '#f39c12'
        default:
            return grey[10];
    }
}