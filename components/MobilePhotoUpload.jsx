'use client';

import {useId,useRef} from 'react';

function fileKey(file){
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function mergeFiles(current,incoming){
  const merged=new Map(current.map(file=>[fileKey(file),file]));
  incoming.forEach(file=>merged.set(fileKey(file),file));
  return [...merged.values()];
}

export default function MobilePhotoUpload({label,files=[],onChange}){
  const id=useId().replace(/:/g,'');
  const cameraRef=useRef(null);
  const fileRef=useRef(null);

  const addFiles=(event)=>{
    const selected=Array.from(event.target.files||[]);
    if(selected.length)onChange(mergeFiles(files,selected));
    event.target.value='';
  };

  const removeFile=(target)=>onChange(files.filter(file=>fileKey(file)!==fileKey(target)));

  return <section style={{border:'1px solid #cbd5e1',borderRadius:14,padding:16,background:'white'}}>
    <div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'baseline',marginBottom:10}}>
      <label className="label" htmlFor={`${id}-files`} style={{margin:0}}>{label}</label>
      <span style={{fontSize:12,fontWeight:800,color:'#64748b'}}>Optional</span>
    </div>

    <p className="muted" style={{margin:'0 0 14px',fontSize:14}}>
      Take a new picture or choose photos and files already on this device.
    </p>

    <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
      <button className="btn-primary" type="button" onClick={()=>cameraRef.current?.click()} style={{flex:'1 1 180px',padding:'12px 10px'}}>
        Take Picture
      </button>
      <button className="btn-secondary" type="button" onClick={()=>fileRef.current?.click()} style={{flex:'1 1 180px',padding:'12px 10px'}}>
        Choose Photos / Files
      </button>
    </div>

    <input
      ref={cameraRef}
      id={`${id}-camera`}
      type="file"
      accept="image/*"
      capture="environment"
      onChange={addFiles}
      style={{display:'none'}}
      tabIndex={-1}
    />
    <input
      ref={fileRef}
      id={`${id}-files`}
      type="file"
      accept="image/*,video/*"
      multiple
      onChange={addFiles}
      style={{display:'none'}}
      tabIndex={-1}
    />

    {files.length>0&&<div style={{marginTop:14}}>
      <div style={{fontSize:13,fontWeight:800,color:'#0B2F5B',marginBottom:8}}>
        {files.length} file{files.length===1?'':'s'} selected
      </div>
      <div style={{display:'grid',gap:8}}>
        {files.map(file=><div key={fileKey(file)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,background:'#f8fafc',borderRadius:10,padding:'9px 10px'}}>
          <span title={file.name} style={{minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:13,color:'#334155'}}>{file.name}</span>
          <button type="button" onClick={()=>removeFile(file)} aria-label={`Remove ${file.name}`} style={{border:0,background:'transparent',color:'#b42318',fontWeight:900,padding:4}}>Remove</button>
        </div>)}
      </div>
    </div>}
  </section>
}
