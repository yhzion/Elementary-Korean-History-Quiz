// SVG 이미지를 PNG로 변환하는 방법을 제공하는 코드입니다.
// 이 코드는 브라우저에서 실행되어야 하므로, HTML 파일을 만들어 브라우저에서 열어 사용해야 합니다.

document.addEventListener('DOMContentLoaded', function() {
    const svgFiles = [
        'student-happy.svg',
        'student-sad.svg',
        'student-thinking.svg',
        'student-excellent.svg',
        'student-ok.svg',
        'teacher.svg'
    ];

    const container = document.getElementById('container');
    let converted = 0;

    svgFiles.forEach(filename => {
        fetch(`images/${filename}`)
            .then(response => response.text())
            .then(svgText => {
                // SVG를 이미지로 변환
                const img = new Image();
                const svg = new Blob([svgText], {type: 'image/svg+xml;charset=utf-8'});
                const url = URL.createObjectURL(svg);
                
                img.onload = function() {
                    // 캔버스 생성 및 이미지 그리기
                    const canvas = document.createElement('canvas');
                    canvas.width = 200;
                    canvas.height = 280;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, 200, 280);
                    
                    // PNG로 변환하여 다운로드 링크 생성
                    const pngUrl = canvas.toDataURL('image/png');
                    const downloadLink = document.createElement('a');
                    downloadLink.href = pngUrl;
                    downloadLink.download = filename.replace('.svg', '.png');
                    downloadLink.textContent = `${filename} 다운로드`;
                    
                    // UI에 추가
                    const div = document.createElement('div');
                    div.className = 'image-container';
                    canvas.style.maxWidth = '100px';
                    div.appendChild(canvas);
                    div.appendChild(downloadLink);
                    container.appendChild(div);
                    
                    converted++;
                    if (converted === svgFiles.length) {
                        document.getElementById('status').textContent = '모든 이미지 변환 완료. 각 이미지를 클릭하여 다운로드하세요.';
                    }
                };
                
                img.src = url;
            })
            .catch(error => {
                console.error('Error loading SVG:', error);
            });
    });
});
