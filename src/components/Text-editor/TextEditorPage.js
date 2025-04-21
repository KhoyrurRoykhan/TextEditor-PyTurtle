import React, { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { dracula } from '@uiw/codemirror-theme-dracula';
import './assets/tutor.css';
import './asset_skulpt/SkulptTurtleRunner.css';
import { Button, Modal, Form } from 'react-bootstrap';
import { BsArrowClockwise, BsPlayFill, BsFolder2Open, BsDownload, BsSave2, BsMoon, BsSun } from 'react-icons/bs';
import './assets/button3d.css';

const TextEditorPage = () => {
    const [pythonCode, setPythonCode] = useState('');
    const [output, setOutput] = useState('');
    const [filename, setFilename] = useState('my_code');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [theme, setTheme] = useState('light');
    const fileInputRef = useRef(null);

    const outf = (text) => {
        setOutput((prev) => prev + text);
    };

    const builtinRead = (x) => {
        if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles['files'][x] === undefined) {
            throw `File not found: '${x}'`;
        }
        return window.Sk.builtinFiles['files'][x];
    };

    const parseSimpleCommands = (code) => {
        const lines = code.split('\n');
        const parsedLines = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];
            const trimmed = line.trim();
            const leadingSpaces = line.match(/^\s*/)?.[0] || '';

            if (trimmed === '' || trimmed.startsWith('#')) {
                parsedLines.push(line);
                i++;
                continue;
            }

            const forMatch = trimmed.match(/^for\s+(\d+)$/);
            if (forMatch) {
                const loopCount = parseInt(forMatch[1]);
                parsedLines.push(`${leadingSpaces}for i in range(${loopCount}):`);
                i++;

                while (i < lines.length) {
                    const nextLine = lines[i];
                    const nextTrimmed = nextLine.trim();
                    const nextIndent = nextLine.match(/^\s*/)?.[0].length || 0;

                    if (nextTrimmed === '' || nextTrimmed.startsWith('#')) {
                        parsedLines.push(nextLine);
                        i++;
                        continue;
                    }

                    if (nextIndent <= leadingSpaces.length) break;

                    const parts = nextTrimmed.split(/\s+/);
                    const cmd = parts[0];
                    const args = parts.slice(1);
                    const isAllArgsNumeric = args.every(arg => !isNaN(parseFloat(arg)));

                    if (nextTrimmed.includes('(') && nextTrimmed.includes(')')) {
                        parsedLines.push(nextLine);
                    } else if (isAllArgsNumeric && args.length > 0) {
                        parsedLines.push(`${nextLine.match(/^\s*/)?.[0] || ''}${cmd}(${args.join(', ')})`);
                    } else {
                        parsedLines.push(nextLine);
                    }
                    i++;
                }
                continue;
            }

            const parts = trimmed.split(/\s+/);
            const cmd = parts[0];
            const args = parts.slice(1);
            const noArgCommands = ['clear', 'home', 'reset', 'penup', 'pendown', 'showturtle', 'hideturtle'];
            const isAllArgsNumeric = args.every(arg => !isNaN(parseFloat(arg)));

            if (trimmed.includes('(') && trimmed.includes(')')) {
                parsedLines.push(line);
            } else if (noArgCommands.includes(cmd) && args.length === 0) {
                parsedLines.push(`${leadingSpaces}${cmd}()`);
            } else if (isAllArgsNumeric && args.length > 0) {
                parsedLines.push(`${leadingSpaces}${cmd}(${args.join(', ')})`);
            } else {
                parsedLines.push(line);
            }
            i++;
        }

        return parsedLines.join('\n');
    };

    const runit = (code, forceReset = false) => {
        setOutput('');
        const imports = "from turtle import *\nreset()\nshape('turtle')\n";
        const parsedCode = parseSimpleCommands(pythonCode);
        const prog = forceReset ? imports : imports + parsedCode;

        window.Sk.pre = "output";
        window.Sk.configure({ output: outf, read: builtinRead });
        (window.Sk.TurtleGraphics || (window.Sk.TurtleGraphics = {})).target = 'mycanvas';

        window.Sk.misceval.asyncToPromise(() =>
            window.Sk.importMainWithBody('<stdin>', false, prog, true)
        ).then(
            () => console.log('success'),
            (err) => setOutput((prev) => prev + err.toString())
        );
    };

    const resetCode = () => {
        setPythonCode('');
        setOutput('');
        runit('', true);
    };

    useEffect(() => {
        runit('', true);
    }, []);

    const handleOpenFile = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setPythonCode(e.target.result);
            setFilename(file.name.replace('.py', ''));
        };
        reader.readAsText(file);
    };

    const handleSaveFile = () => {
        const blob = new Blob([pythonCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const safeFilename = filename.trim() !== '' ? filename.trim() : 'my_code';
        const finalFilename = safeFilename.endsWith('.py') ? safeFilename : `${safeFilename}.py`;
        link.download = finalFilename;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{height:"100%"}}>
            <div className='content' style={{ paddingLeft: 50, paddingRight: 50, marginTop: 75 }}>
                {/* Toggle Theme */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                    <Button variant="secondary" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                        {theme === 'light' ? <BsMoon /> : <BsSun />} Ganti ke {theme === 'light' ? 'Gelap' : 'Terang'}
                    </Button>
                </div>

                <div className="skulpt-container" style={{ border: "2px solid #ccc" }}>
                    <div className="editor-section">
                        <CodeMirror
                            placeholder={'# Tuliskan kode anda disini!'}
                            value={pythonCode}
                            height="400px"
                            theme={theme === 'dark' ? 'dark' : 'light'}
                            extensions={[python()]}
                            onChange={(value) => setPythonCode(value)}
                            style={{ border: '1px solid #ccc' }}
                        />

                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <a onClick={() => runit()} className='button-3d-run'>
                                <BsPlayFill /> Jalankan
                            </a>
                            <a onClick={resetCode} className='button-3d-reset'>
                                <BsArrowClockwise /> Reset
                            </a>
                            <a className='button-3d-open' onClick={() => fileInputRef.current.click()} >
                                <BsFolder2Open /> Buka File
                            </a>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".py"
                                style={{ display: 'none' }}
                                onChange={handleOpenFile}
                            />
                            <a className='button-3d-open' onClick={() => setShowSaveModal(true)}>
                                <BsSave2 /> Simpan File
                            </a>
                        </div>

                        <pre className="output mt-3" style={{ height: 60 }}>{output}</pre>
                    </div>

                    <div className="canvas-section" style={{ maxWidth: 400, maxHeight: 400 }}>
                        <div id="mycanvas"></div>
                    </div>
                </div>
            </div>

            <Modal show={showSaveModal} onHide={() => setShowSaveModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Simpan File</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Nama File</Form.Label>
                        <Form.Control
                            type="text"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            placeholder="Masukkan nama file"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <a onClick={() => setShowSaveModal(false)} className='button-3d-grey'>Batal</a>
                    <a onClick={() => {
                        handleSaveFile();
                        setShowSaveModal(false);
                    }} className='button-3d-open'>
                        <BsDownload /> Simpan
                    </a>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TextEditorPage;
