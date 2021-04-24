// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const DragSelect = require('dragselect');

var position = 0;
let image0 = "data:image/png;base64,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b2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgIHhtcE1NOkRvY3VtZW50SUQ9ImdpbXA6ZG9jaWQ6Z2ltcDpiNDA5MmVjYi1iYTQ2LTRmZWEtYmM1Mi0zMTM2Y2M4YTQyZDMiCiAgIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YzhkZTdkZjctNjM1Yy00MDU3LWJhOTMtZmZiN2ZiOGQ0NTNiIgogICB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTlhOTRlZjgtOGM1NS00YWQyLWI3MTItMzdlOWYyN2E5Y2FjIgogICBHSU1QOkFQST0iMi4wIgogICBHSU1QOlBsYXRmb3JtPSJMaW51eCIKICAgR0lNUDpUaW1lU3RhbXA9IjE2MTgxMjc0ODUyNTQwODEiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4yMiIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIj4KICAgPGlwdGNFeHQ6TG9jYXRpb25DcmVhdGVkPgogICAgPHJkZjpCYWcvPgogICA8L2lwdGNFeHQ6TG9jYXRpb25DcmVhdGVkPgogICA8aXB0Y0V4dDpMb2NhdGlvblNob3duPgogICAgPHJkZjpCYWcvPgogICA8L2lwdGNFeHQ6TG9jYXRpb25TaG93bj4KICAgPGlwdGNFeHQ6QXJ0d29ya09yT2JqZWN0PgogICAgPHJkZjpCYWcvPgogICA8L2lwdGNFeHQ6QXJ0d29ya09yT2JqZWN0PgogICA8aXB0Y0V4dDpSZWdpc3RyeUlkPgogICAgPHJkZjpCYWcvPgogICA8L2lwdGNFeHQ6UmVnaXN0cnlJZD4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NzI4ZGQ0NDItNTMxMC00M2FiLTljZTQtZmJlMWVmNzk2N2FmIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKExpbnV4KSIKICAgICAgc3RFdnQ6d2hlbj0iKzA5OjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICAgPHBsdXM6SW1hZ2VTdXBwbGllcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkltYWdlU3VwcGxpZXI+CiAgIDxwbHVzOkltYWdlQ3JlYXRvcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkltYWdlQ3JlYXRvcj4KICAgPHBsdXM6Q29weXJpZ2h0T3duZXI+CiAgICA8cmRmOlNlcS8+CiAgIDwvcGx1czpDb3B5cmlnaHRPd25lcj4KICAgPHBsdXM6TGljZW5zb3I+CiAgICA8cmRmOlNlcS8+CiAgIDwvcGx1czpMaWNlbnNvcj4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PvUId3oAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQflBAsHMxk9k9olAAAAEklEQVQ4y2NgGAWjYBSMAggAAAQQAAGFP6pyAAAAAElFTkSuQmCC";

let image7 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkIzMTFFMjk2NTc2RTExRTdBMkMyOEI3M0ZEQjUyNDBBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkIzMTFFMjk3NTc2RTExRTdBMkMyOEI3M0ZEQjUyNDBBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjMxMUUyOTQ1NzZFMTFFN0EyQzI4QjczRkRCNTI0MEEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjMxMUUyOTU1NzZFMTFFN0EyQzI4QjczRkRCNTI0MEEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5JI2+NAAAAWklEQVR42sSTYQsAEAxEnfz/v3xS0loLG7JPSu91rgHJdDI5HU4ZJ8AXhUQ8QYdjAgH7BQq+UqJPYBTtT6AksScIyaMOWttG43t7IEFLMt2DFWDc4/tvrAIMAJG/JBKp/LnGAAAAAElFTkSuQmCC";

let image3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjEzM0RCMEIyNTdBMzExRTdCQkQ2QURBMDYyNzNCQjk0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjEzM0RCMEIzNTdBMzExRTdCQkQ2QURBMDYyNzNCQjk0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTMzREIwQjA1N0EzMTFFN0JCRDZBREEwNjI3M0JCOTQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTMzREIwQjE1N0EzMTFFN0JCRDZBREEwNjI3M0JCOTQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5eSPmlAAAAWUlEQVR42mL8//8/AyWAiYFCgNUARnmG/yCMSxOyHBM+SWyGoIsx4ZMkxkAWfJLEyFEvEP8/ZGCkOBbIMQTDC6QaQv2EhC/ECRpAqmYUA8jRDNY34LkRIMAAQrAbcPrfu8UAAAAASUVORK5CYII=";

let image1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlCM0Y4OTdDNTc2RTExRTdBMDQ2RDFBQjk5NzhCQTM3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjlCM0Y4OTdENTc2RTExRTdBMDQ2RDFBQjk5NzhCQTM3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUIzRjg5N0E1NzZFMTFFN0EwNDZEMUFCOTk3OEJBMzciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OUIzRjg5N0I1NzZFMTFFN0EwNDZEMUFCOTk3OEJBMzciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6OQM81AAAAWUlEQVR42mL8//8/AyWAiYFCADeAUZ4Bp1NAcrjkmdAVYtOMT56JVA3oYoywQMTnBWzg/0MGRuoGIjm2k2UAsmaSDUDXTP8wICodkGoIWV5ASWwDnhsBAgwANV8fLK9R2YUAAAAASUVORK5CYII=";

let image9 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkNBRUY2NUNDNTc2RTExRTdCNzc1Q0Y2MzlENkVENjYzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkNBRUY2NUNENTc2RTExRTdCNzc1Q0Y2MzlENkVENjYzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0FFRjY1Q0E1NzZFMTFFN0I3NzVDRjYzOUQ2RUQ2NjMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0FFRjY1Q0I1NzZFMTFFN0I3NzVDRjYzOUQ2RUQ2NjMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz72HMNeAAAAV0lEQVR42mL8//8/AyWAiYFCwAJnMTKS5pT//xlRXQAVoMwLZBjChMtpdAtETANIDEwmSjSjGkCGZiqHAb7QB8nhkCecDpDFsMgzkaoBXYxxwHMjQIABAO3CJBJl+kbXAAAAAElFTkSuQmCC";

let image5 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJFMzBBRjY5NTc2RTExRTc4MUM2ODQ0MDA4RDc4OEI3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJFMzBBRjZBNTc2RTExRTc4MUM2ODQ0MDA4RDc4OEI3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkUzMEFGNjc1NzZFMTFFNzgxQzY4NDQwMDhENzg4QjciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkUzMEFGNjg1NzZFMTFFNzgxQzY4NDQwMDhENzg4QjciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6qB2mRAAAAO0lEQVR42mL8//8/AyWAiYFCwILMYWRkJMo5QFczYriAWM3oain2wqgBowagGICcPElJyowDnhsBAgwAoqMSG02UoxAAAAAASUVORK5CYII=";


function StepData() {
    // 스텝데이터
    this.unitStep = "0000000000000".split('');
    // 변속 데이터
    this.unitCop = [];
    this.div = null;
}

function KsfFile()
{
    this.textData = "";
    this.div = null;
    this.title = "";
    this.player = "";
    this.bpm1 = 0;
    this.startTime = 0;
    this.tickCount = 4; 
    this.introFile = "";
    this.songFile = "";
    this.discFile = "";
    this.titleFile = "";
    this.difficulty = 0;
    this.bpm2 = "";
    this.bpm3 = "";
    this.bunki1 = 0;
    this.bunki2 = 0;
    this.startTime2 = 0;
    this.startTime3 = 0; 
    this.rawData = null;
    this.steps = []; //
    this.isactive = true; 

    this.position = 0;
}

KsfFile.prototype.setPosition = function(n) {
    this.position = n;
    this.steps[n].div.focus(); 
};

var files = [];

function addFile(binary, path) {
    var f = new KsfFile();
    f.textData = binary;
    f.isactive = true;
    f.position = 0;
    files.push(f); 
    var ret = assaLex(f.textData);
    var state = 0;
    console.log(ret);
    for(let i=0; i<ret.length; i++) {
        var rrr = ret[i];
        if (rrr[0] == "TITLE") {
            f.title = ret[i+1][1];
        } else if (rrr[0] == "BPM") {
            f.bpm = ret[i+1][1];
        } else if (rrr[0] == "STARTTIME") {
            f.starttime = ret[i+1][1];
        } else if (rrr[0] == "TICKCOUNT") {
            f.tickcount = ret[i+1][1];
        } else if (rrr[0] == "STEP") {
            let index = f.steps.length;
            let stepDiv = document.createElement('div');
            stepDiv.setAttribute("tabIndex", "0");
            stepDiv.classList.add('step_row');
            stepDiv.classList.add('selectable-nodes');
            stepDiv.addEventListener("keydown", (e) => {
                if (e.code == "ArrowDown") {
                    f.setPosition(f.position + 1);
                } else if (e.code == "ArrowUp") {
                    f.setPosition(f.position - 1);
                } else if (e.code == "ArrowLeft") {
                } else if (e.code == "ArrowRight") {
                } else if (e.code == "KeyZ") {
                    if (f.steps[index].unitStep[0] != '0') {
                        f.steps[index].unitStep[0] = '0';
                        f.steps[index].div.imgs[0].src = image0; // 'img/0.png';
                    } else {
                        f.steps[index].unitStep[0] = '1';
                        f.steps[index].div.imgs[0].src = image1; // 'img/1.png';
                    } 
                } else if (e.code == "KeyQ") {
                    if (f.steps[index].unitStep[1] != '0') {
                        f.steps[index].unitStep[1] = '0';
                        f.steps[index].div.imgs[1].src = image0; // 'img/0.png';
                    } else {
                        f.steps[index].unitStep[1] = '1';
                        f.steps[index].div.imgs[1].src = image7; // 'img/7.png';
                    } 
                } else if (e.code == "KeyS") {
                    if (f.steps[index].unitStep[2] != '0') {
                        f.steps[index].unitStep[2] = '0';
                        f.steps[index].div.imgs[2].src = image0; // 'img/0.png';
                    } else {
                        f.steps[index].unitStep[2] = '1';
                        f.steps[index].div.imgs[2].src = image5; // 'img/5.png';
                    } 
                } else if (e.code == "KeyE") {
                    if (f.steps[index].unitStep[3] != '0') {
                        f.steps[index].unitStep[3] = '0';
                        f.steps[index].div.imgs[3].src = image0; // 'img/0.png';
                    } else {
                        f.steps[index].unitStep[3] = '1';
                        f.steps[index].div.imgs[3].src = image9; // 'img/9.png';
                    } 
                } else if (e.code == "KeyC") {
                    if (f.steps[index].unitStep[4] != '0') {
                        f.steps[index].unitStep[4] = '0';
                        f.steps[index].div.imgs[4].src = image0; // 'img/0.png';
                    } else {
                        f.steps[index].unitStep[4] = '1';
                        f.steps[index].div.imgs[4].src = image1; // 'img/3.png';
                    } 
                } else if (e.code == "Insert") {
                    f.steps.splice(index, 0, new StepData());
                } else if (e.code == "Delete") {
                }

                console.log(e);
                // e.stopPropagation(); 
                e.preventDefault();

            });

            let step = new StepData();
            step.unitStep = rrr[1].split('');
            step.imgs = [];
            f.steps.push(step); 
            step.div = stepDiv;

            stepDiv.addEventListener('click', function() {
                // for(let j=0; j<f.stepData.length; j++) {
                //     f.stepData[j].div.style.backgroundColor = "#fff";
                // }
                // stepData.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
                f.setPosition(index);
                console.log('row click: ', index);
            });
            let eachStep = step.unitStep; // .split(''); 
            document.getElementById('center').appendChild(stepDiv);
            stepDiv.imgs = [];
            for (var j=0; j<eachStep.length; j++) {
                var fileName = ''; 
                if (eachStep[j] != '0') {
                    if(j == 0 || j == 0 + 5) {
                        fileName = 'img/1.png';
                    } else if(j == 1 || j == 6) {
                        fileName = 'img/7.png';
                    } else if(j == 2 || j == 7) {
                        fileName = 'img/5.png';
                    } else if(j == 3 || j == 8) {
                        fileName = 'img/9.png';
                    } else if(j == 4 || j == 9) {
                        fileName = 'img/3.png';
                    } 
                } else {
                    fileName = 'img/0.png';
                }
                var img = document.createElement('img');
                // img.classList.add("item");
                img.src = fileName;
                stepDiv.appendChild(img);
                stepDiv.imgs.push(img);
            } 
        } 
    }

    new DragSelect({
                   selectables: document.querySelectorAll('.step_row'),
                   callback: e => {
                       console.log(e);
                   }
    });


    // f.stepData[5].div.focus(); 
    // for(let j=0; j<f.stepData.length; j++) {
    //     f.stepData[j].div.style.backgroundColor = "#fff";
    // }
    // f.stepData[position].div.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
    f.textData = null;
}


document.querySelector('#new_file').addEventListener('click', () => {
    console.log(remote);
    remote.dialog.showOpenDialog().then(result => {
        console.log(result.canceled)
        console.log("path:" ,result.filePaths)
        var  readFile = function(filepath) {
            window.fs.readFile(filepath, 'utf-8',(err, data) => {
                if(err){
                    alert("An error ocurred reading the file :" + err.message);
                    return;
                } 
                // handle the file content 
                addFile(data, filepath);
            });
        }
        readFile(result.filePaths[0]);

    }).catch(err => {
        console.log(err)
    });

})
function assaLex(text){
//     var keywords = [
// "#TITLE:","#STEP:","#TICKCOUNT:","#BPM:","#STARTTIME",];

    var tokList = [
        ['STRING', "\"([^\"]|\\.)*\""],
        ['TITLE', '#TITLE:'],
        ['STEPSYMBOL', '#STEP:'],
        ['TICKCOUNT', '#TICKCOUNT:'],
        ['BPM', '#BPM:'],
        ['STARTTIME', '#STARTTIME:'], 
        ['STEP', "[0-9]{13}"],
        ['NUMBER', "[0-9]+"],
        ['WORD', "([a-zA-Z0-9_-]| )+"],
        ['NEWLINE', "\\n+"],
        ['NEWLINE2', "\\r+"],
        ['SEMI', ";"],
        ['OTHER', "\\S"],
    ];

    var sub = text;
    var ret = [];

    while(sub){
        var i=0;
        for(i=0; i < tokList.length; i++){
            var match = sub.match(new RegExp("^"+"("+tokList[i][1]+")",""));
            if(match){
                break;
            }
        }
        if(i < tokList.length){
            // alert(tokList[i][0] + " " + match[0] );
            ret.push([tokList[i][0], match[0]]);
            sub = sub.substring(match[0].length);
        }else{
            return null;
        }
    }
    return ret;
}
