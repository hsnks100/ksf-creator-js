// KSF Creator2View.cpp : CKSFCreator2View 클래스의 구현
//

#include "stdafx.h"
#include "KSF Creator2.h"

#include "KSF Creator2Doc.h"
#include "KSF Creator2View.h"
#include "MainFrm.h"

#include "ksftopic.h"


#include "debugging.h"


#ifdef _DEBUG
#define new DEBUG_NEW
#endif

using std::map;
// CKSFCreator2View

IMPLEMENT_DYNCREATE(CKSFCreator2View, CScrollView)

BEGIN_MESSAGE_MAP(CKSFCreator2View, CScrollView)
	// 표준 인쇄 명령입니다.
	ON_COMMAND(ID_FILE_PRINT, &CScrollView::OnFilePrint)
	ON_COMMAND(ID_FILE_PRINT_DIRECT, &CScrollView::OnFilePrint)
	ON_COMMAND(ID_FILE_PRINT_PREVIEW, &CScrollView::OnFilePrintPreview)
	ON_WM_SIZE()
	ON_WM_KEYDOWN()
	ON_COMMAND(ID_SINGLE, &CKSFCreator2View::OnSingle)
	ON_COMMAND(ID_DOUBLE, &CKSFCreator2View::OnDouble)
	ON_WM_LBUTTONDOWN()
	ON_COMMAND(ID_1X, &CKSFCreator2View::On1x)
	ON_COMMAND(ID_2X, &CKSFCreator2View::On2x)
	ON_COMMAND(ID_3X, &CKSFCreator2View::On3x)
	ON_COMMAND(ID_4X, &CKSFCreator2View::On4x)
	ON_COMMAND(ID_5X, &CKSFCreator2View::On5x)
	ON_COMMAND(ID_8X, &CKSFCreator2View::On8x)
	ON_WM_MOUSEMOVE()
	ON_COMMAND(ID_PLAYKSF, &CKSFCreator2View::OnPlayksf)
	ON_COMMAND(ID_PLAYKSF0, &CKSFCreator2View::OnPlayksf0)
	ON_WM_DESTROY()
	ON_WM_TIMER()
	ON_COMMAND(ID_STOP, &CKSFCreator2View::OnStop)
	ON_COMMAND(ID_KSFTOPIC, &CKSFCreator2View::OnKsftopic)
	ON_WM_RBUTTONUP()
END_MESSAGE_MAP()

// CKSFCreator2View 생성/소멸

CKSFCreator2View::CKSFCreator2View()
{
	// TODO: 여기에 생성 코드를 추가합니다.
	BeginSel = 0;
	EndSel = 0;
	Double = false;
	speedrate = 1;

	stream = 0;	
}

void CKSFCreator2View::OnInitialUpdate()
{
	CScrollView::OnInitialUpdate();
	
	ArrowImg.LoadBitmap(IDB_ARROW);
	COPImg.LoadBitmap(IDB_COP);
	COP2Img.LoadBitmap(IDB_COP2);
	
	Brush.CreateSolidBrush(RGB(255, 200, 245));
	Brush2.CreateSolidBrush(RGB(151, 221, 255));
	Pen.CreatePen(PS_SOLID, 0, RGB(255, 200, 245));
	Pen2.CreatePen(PS_SOLID, 0, RGB(255, 0, 0));
	Pen3.CreatePen(PS_SOLID, 0, RGB(151, 221, 255));
	SetScroll();
}

CKSFCreator2View::~CKSFCreator2View()
{
	ArrowImg.DeleteObject();
	COPImg.DeleteObject();
	COP2Img.DeleteObject();

	Brush.DeleteObject();
	Brush2.DeleteObject();

	Pen.DeleteObject();
	Pen2.DeleteObject();
	Pen3.DeleteObject();


	hBit.DeleteObject();
}

// CKSFCreator2View 그리기

void CKSFCreator2View::OnDraw(CDC* pDC)
{	
	// TODO: 여기에 원시 데이터에 대한 그리기 코드를 추가합니다.
	RECT area;
	GetClientRect(&area);
	CDC hMemDC;
	hMemDC.CreateCompatibleDC(pDC);
	CBitmap* OldBitmap = hMemDC.SelectObject(&hBit);
	drawWhite(hMemDC, area.bottom);

	std::set<int> linelist; // 주마디선이 그이는 y 좌표
	std::vector<POINT> stepposlist;

	if(adjustLineData(linelist, stepposlist, area.bottom) == true)
	{		
		
		drawLine(hMemDC, linelist, area.bottom);
		drawBackFromVariableSpeed(hMemDC, stepposlist);
		drawBack(hMemDC, stepposlist);	
		drawVariableSpeed(hMemDC, stepposlist);
		drawNote(hMemDC, stepposlist);

		pDC->BitBlt(0,0, getWidth(area.bottom), area.bottom, &hMemDC, 0, 0, SRCCOPY);
	}
	hMemDC.SelectObject(OldBitmap);
	hMemDC.DeleteDC();
}



// CKSFCreator2View 인쇄

BOOL CKSFCreator2View::OnPreparePrinting(CPrintInfo* pInfo)
{
	// 기본적인 준비
	return DoPreparePrinting(pInfo);
}

// CKSFCreator2View 진단

#ifdef _DEBUG

CKSFCreator2Doc* CKSFCreator2View::GetDocument() const // 디버그되지 않은 버전은 인라인으로 지정됩니다.
{
	ASSERT(m_pDocument->IsKindOf(RUNTIME_CLASS(CKSFCreator2Doc)));
	return (CKSFCreator2Doc*)m_pDocument;
}
#endif //_DEBUG


// CKSFCreator2View 메시지 처리기

void CKSFCreator2View::OnSize(UINT nType, int cx, int cy)
{
	CScrollView::OnSize(nType, cx, cy);
	// TODO: Add your message handler code here
	SetScroll();
}

void CKSFCreator2View::OnKeyDown(UINT nChar, UINT nRepCnt, UINT nFlags)
{
	// TODO: Add your message handler code here and/or call default

	CKSFCreator2Doc* pDoc = (CKSFCreator2Doc*)GetDocument();
	RECT area;
	GetClientRect(&area);
	
	switch(nChar)
	{
	case VK_F4:
		OnPlayksf();
		break;
	case VK_F5:
		OnPlayksf0();
		break;
	case VK_ESCAPE:
		OnStop();
		break;
	case 'X':
		if( GetKeyState(VK_CONTROL) & 0x8000 )
			GetDocument()->OnEditCut();
		break;
	case 'V':
		if( GetKeyState(VK_CONTROL) & 0x8000 )
			GetDocument()->OnEditPaste();
		break;
	case 'I':
		if( GetKeyState(VK_CONTROL) & 0x8000 )
			GetDocument()->OnSpacesetting();
		break;
	case 'T':
		if( GetKeyState(VK_CONTROL) & 0x8000 )
			GetDocument()->OnStepRotation();		
		break;
	case VK_INSERT:
		if( GetKeyState(VK_CONTROL) & 0x8000 )
			GetDocument()->OnPushbackstep();
		else
			GetDocument()->OnInsertstep();
		break;
	case VK_DELETE:
			GetDocument()->OnRemovestep();
		break;
	case VK_DOWN:
		if(EndSel<pDoc->m_ksf.getStepInfo().size()-1)
			EndSel++;
		break;
	case VK_UP:
		if(EndSel > 0)
			EndSel--;
		break;
	case VK_RIGHT:
	case VK_NEXT:
		{
			std::set<int> linelist; // 주마디선이 그이는 y 좌표
			std::vector<POINT> stepposlist;
			adjustLineData(linelist, stepposlist, area.bottom);
			bool repeat = false;
			int oldsel = EndSel;
			for(unsigned int row=EndSel+1; row<pDoc->m_ksf.getStepInfo().size(); row++)
			{
				EndSel = row;
				if(stepposlist[row-1].y > stepposlist[row].y)
					repeat = true;
				if(repeat && stepposlist[row].y >= stepposlist[oldsel].y)
				{
					EndSel = row;
					break;
				}
			}
		}
		break;
	case VK_LEFT:
	case VK_PRIOR:
		{
			std::set<int> linelist; // 주마디선이 그이는 y 좌표
			std::vector<POINT> stepposlist;
			adjustLineData(linelist, stepposlist, area.bottom);
			bool repeat = false;
			unsigned int oldsel = EndSel;
			for(int row=(int)oldsel-1; row>=0; row--)
			{
				EndSel = row;
				if(stepposlist[row+1].y < stepposlist[row].y)
					repeat = true;
				if(repeat && stepposlist[row].y <= stepposlist[oldsel].y)
				{
					EndSel = row;
					break;
				}
			}
		}
		break;
	case VK_HOME:
		EndSel = 0;
		break;
	case VK_END:
		EndSel = pDoc->m_ksf.getStepInfo().size()-1;
		break;
	case VK_SPACE:
		{
			GetDocument()->OnInsertspeed();
			break;
		}
	case VK_NUMPAD1:
		if(Double)
			pDoc->m_ksf.SetStep(Double, 5, BeginSel, EndSel);
		else
			pDoc->m_ksf.SetStep(Double, 0, BeginSel, EndSel);
		break;
	case VK_NUMPAD7:
		if(Double)
			pDoc->m_ksf.SetStep(Double, 6, BeginSel, EndSel);
		else
			pDoc->m_ksf.SetStep(Double, 1, BeginSel, EndSel);	
		break;
	case VK_NUMPAD5:
		if(Double)			
			pDoc->m_ksf.SetStep(Double, 7, BeginSel, EndSel);			
		else			
			pDoc->m_ksf.SetStep(Double, 2, BeginSel, EndSel);			
		break;
	case VK_NUMPAD9:
		if(Double)			
			pDoc->m_ksf.SetStep(Double, 8, BeginSel, EndSel);			
		else			
			pDoc->m_ksf.SetStep(Double, 3, BeginSel, EndSel);	
		break;
	case VK_NUMPAD3:
		if(Double)
			pDoc->m_ksf.SetStep(Double, 9, BeginSel, EndSel);			
		else			
			pDoc->m_ksf.SetStep(Double, 4, BeginSel, EndSel);
		break;
	case 'Z':
		pDoc->m_ksf.SetStep(Double, 0, BeginSel, EndSel);
		break;
	case 'Q':
		pDoc->m_ksf.SetStep(Double, 1, BeginSel, EndSel);
		break;
	case 'S':
		pDoc->m_ksf.SetStep(Double, 2, BeginSel, EndSel);
		break;
	case 'E':
		pDoc->m_ksf.SetStep(Double, 3, BeginSel, EndSel);
		break;
	case 'C':
		if( GetKeyState(VK_CONTROL) & 0x8000 )
			GetDocument()->OnEditCopy();
		else
			pDoc->m_ksf.SetStep(Double, 4, BeginSel, EndSel);
		break;
	}

	switch(nChar)
	{
	case 'C':
	case 'S':
	case 'Z':
	case 'Q':
	case 'E':
	case VK_NUMPAD9:
	case VK_NUMPAD5:
	case VK_NUMPAD7:
	case VK_NUMPAD1:
	case VK_NUMPAD3:
		GetDocument()->SetModifiedFlag(TRUE);
	}
	
	switch(nChar)
	{
	case VK_RIGHT:
	case VK_LEFT:
	case VK_UP:
	case VK_DOWN:
	case VK_PRIOR:
	case VK_NEXT:
	case VK_HOME:
	case VK_END:
		if(!(GetKeyState (VK_SHIFT) & 0x8000))
			BeginSel = EndSel;
		MoveScroll(EndSel);
	}
	
	if( GetKeyState(VK_CONTROL) & 0x8000 )
	{
		switch(nChar)
		{
		case '1':
			On1x();
			break;
		case '2':
			On2x();
			break;
		case '3':
			On3x();
			break;
		case '4':
			On4x();
			break;
		case '5':
			On5x();
			break;
		case '6':
			On8x();
			break;
		}
	}
	Invalidate(FALSE);
	CScrollView::OnKeyDown(nChar, nRepCnt, nFlags);
}

void CKSFCreator2View::OnSingle()
{
	// TODO: Add your command handler code here
	makewhite();
	Double = false;

	SetScroll();
	Invalidate(FALSE);
}

void CKSFCreator2View::SetScroll()
{
	CSize sizeTotal;
	sizeTotal.cy = 0();
	RECT area;
	GetClientRect(&area);
	sizeTotal.cx = getWidth(area.bottom);
	
	SetScrollSizes(MM_TEXT, sizeTotal);

	//비트맵 생성
	CClientDC dc(this);
	RECT rt;
	GetClientRect(&rt);
	if(hBit.m_hObject != NULL)
	{
		hBit.DeleteObject();
	}
	////
	
	//CreateCompatibleBitmap 으로 생성한 비트맵이 더 빠르지만 실패할 경우 MakeDIBSection 으로 대체함.
	if(!hBit.CreateCompatibleBitmap(&dc, getWidth(rt.bottom), rt.bottom))
	{
		hBit.Attach(MakeDIBSection(&dc, getWidth(rt.bottom), rt.bottom));
	}
}

void CKSFCreator2View::OnDouble()
{
	// TODO: Add your command handler code here
	makewhite();
	Double = true;
	SetScroll();
	Invalidate(FALSE);
}

void CKSFCreator2View::OnLButtonDown(UINT nFlags, CPoint point)
{
	// TODO: Add your message handler code here and/or call default
	RECT area;
	GetClientRect(&area);
	std::set<int> linelist; // 주마디선이 그이는 y 좌표
	std::vector<POINT> stepposlist;
	adjustLineData(linelist, stepposlist, area.bottom);

	SCROLLINFO sinfo;
	ZeroMemory(&sinfo, sizeof(SCROLLINFO));
	GetScrollInfo(SB_HORZ, &sinfo);
	std::set<int> col;
	for(std::vector<POINT>::iterator it=stepposlist.begin(); it != stepposlist.end(); it++)
	{
		col.insert(it->x);
	}

	int colpos = *max_element(col.begin(), col.end());
	CKSFCreator2Doc* pDoc = GetDocument();
	EndSel = pDoc->m_ksf.getStepInfo().size()-1;

	for(std::set<int>::iterator it=col.begin(); it != col.end(); it++)
	{
		if(point.x + sinfo.nPos < *it)
		{
			it--;
			colpos = *it;
			break;
		}
	}

	for(int i=0; i<stepposlist.size()-1; i++)
	{
		bool a = point.y < stepposlist[i+1].y;
		bool b = stepposlist[i+1].y == 0 && stepposlist[i].y != 0;
		bool c  = stepposlist[i].x == colpos;
		if((a || b) && c)
		{
			EndSel = i;			
			break;
		}
	}

	if(!(nFlags & MK_SHIFT))
		BeginSel = EndSel;
	
	//MoveScroll(EndSel);
	Invalidate(FALSE);
	CScrollView::OnLButtonDown(nFlags, point);
}

void CKSFCreator2View::On1x()
{
	// TODO: Add your command handler code here
	makewhite();
	speedrate = 1;
	SetScroll();
	Invalidate(FALSE);
}

void CKSFCreator2View::On2x()
{
	// TODO: Add your command handler code here
	makewhite();
	speedrate = 2;
	SetScroll();
	Invalidate(FALSE);
}

void CKSFCreator2View::On3x()
{
	// TODO: Add your command handler code here
	makewhite();
	speedrate = 3;
	SetScroll();
	Invalidate(FALSE);
}

void CKSFCreator2View::On4x()
{
	// TODO: Add your command handler code here
	makewhite();
	speedrate = 4;
	SetScroll();
	Invalidate(FALSE);
}

void CKSFCreator2View::On5x()
{
	// TODO: Add your command handler code here
	makewhite();
	speedrate = 5;
	SetScroll();
	Invalidate(FALSE);
}

void CKSFCreator2View::On8x()
{
	// TODO: Add your command handler code here
	makewhite();
	speedrate = 8;
	SetScroll();	
	Invalidate(FALSE);
}

void CKSFCreator2View::OnMouseMove(UINT nFlags, CPoint point)
{
	// TODO: Add your message handler code here and/or call default
	
	if(nFlags == MK_LBUTTON)
	{
		RECT area;
		GetClientRect(&area);
		std::set<int> linelist; // 주마디선이 그이는 y 좌표
		std::vector<POINT> stepposlist;
		adjustLineData(linelist, stepposlist, area.bottom);
		SCROLLINFO sinfo;
		ZeroMemory(&sinfo, sizeof(SCROLLINFO));
		GetScrollInfo(SB_HORZ, &sinfo);
		std::set<int> col;
		for(std::vector<POINT>::iterator it=stepposlist.begin(); it != stepposlist.end(); it++)
		{
			col.insert(it->x);
		}
		if(col.empty() == 0)
		{
			int colpos = *max_element(col.begin(), col.end());
			CKSFCreator2Doc* pDoc = GetDocument();
			EndSel = pDoc->m_ksf.getStepInfo().size()-1;

			for(std::set<int>::iterator it=col.begin(); it != col.end(); it++)
			{
				if(point.x + sinfo.nPos < *it)
				{
					it--;
					colpos = *it;
					break;
				}
			}

			for(int i=1; i<stepposlist.size(); i++)
			{
				if(
					(point.y < stepposlist[i].y || stepposlist[i].y == 0) && 
					stepposlist[i-1].x == colpos)
				{
					EndSel = i-1;

					break;
				}
			}
			//MoveScroll(EndSel);
			Invalidate(FALSE);
		}
	}
	
	CScrollView::OnMouseMove(nFlags, point);
}

void CKSFCreator2View::MoveScroll(int sel)
{
	/*RECT area;
	GetClientRect(&area);
	area.bottom -= 20;
	area.bottom -= area.bottom %16;
	SCROLLINFO sinfo;
	ZeroMemory(&sinfo, sizeof(sinfo));
	GetScrollInfo(SB_HORZ, &sinfo);
	int currentcol = 1;

	int countpercol = area.bottom/4/speedrate;
	int select = sel;
	currentcol = select/countpercol;
	int a;
	int b;
	if(Double)
	{		
		a = 16*11*(currentcol);
		b = a + 16*11;	
		
	}
	else
	{
		a = 16*6*(currentcol);
		b = a + 16*6;
	}

	if(sinfo.nPos + area.right < b)
	{
		sinfo.nPos = b - area.right;
		SetScrollInfo(SB_HORZ, &sinfo);
	}
	else if(a < sinfo.nPos)
	{
		sinfo.nPos = a;
		SetScrollInfo(SB_HORZ, &sinfo);
	}*/
}
void CKSFCreator2View::OnPlayksf()
{
	// TODO: Add your command handler code here
	GetDocument()->m_ksf.createTable();
	FILE* fp = _tfopen(TEXT("aa.txt"), TEXT("a"));
	for(int j=0; j<GetDocument()->m_ksf.getStepData().m_StepInfo.size(); j++)
		fprintf(fp, "%d\n", GetDocument()->m_ksf.indexToTime(j));
	fclose(fp);
	//이미 재생중이라면 스트림을 닫고 다시 염
	if(FSOUND_Stream_GetOpenState(stream) == 0)
	{
		FSOUND_Stream_Close(stream);
		stream = 0;
	}
	CString fullpath;
	fullpath = GetDocument()->GetPathName();
	if(fullpath == TEXT("")) // 경로가 없으면
	{
		MessageBox(TEXT("문서를 저장하시고 파일을 지정해주세요."));
		return;
	}
	{
		TCHAR* tmp = new TCHAR[fullpath.GetLength()+1];
		_tcscpy(tmp, (const TCHAR*)fullpath);
		PathRemoveFileSpec(tmp);
		fullpath = tmp;
		delete [] tmp;
	}
	fullpath += TEXT("\\");
	TCHAR songfilename[256];
	GetDocument()->GetTextBox(songfilename, IDC_SONGFILE);
	if(_tcscmp(songfilename, TEXT("")) == 0)
		_tcscpy(songfilename, TEXT("song.mp3"));
	fullpath += songfilename;
// fmod 가 unicode 를 지원못함
#ifdef _UNICODE 
	char* fullpath2 = new char[fullpath.GetLength()*2+1];
	WideCharToMultiByte( CP_ACP, 0,  (const TCHAR*)fullpath,  -1, 
		fullpath2, fullpath.GetLength()*2+1 , 0, 0 );    
	stream = FSOUND_Stream_Open(fullpath2, FSOUND_NORMAL | FSOUND_MPEGACCURATE, 0, 0);
	delete [] fullpath2;
#else
	stream = FSOUND_Stream_Open(fullpath, FSOUND_NORMAL | FSOUND_MPEGACCURATE, 0, 0);
#endif
	if(stream)
	{
		SetTimer(0, 30, NULL);
		FSOUND_Stream_SetEndCallback(stream, endcallback, this);
		FSOUND_Stream_SetTime(stream, GetDocument()->m_ksf.indexToTime(EndSel));
		FSOUND_Stream_PlayEx(FSOUND_FREE, stream, NULL, FALSE);
	}
	else
		MessageBox(TEXT("재생할 음악 파일이 없습니다."));
}

void CKSFCreator2View::OnPlayksf0()
{
	// TODO: Add your command handler code here
	
	GetDocument()->m_ksf.createTable();
	
	//이미 재생중이라면 스트림을 닫고 다시 염
	if(FSOUND_Stream_GetOpenState(stream) == 0)
	{
		FSOUND_Stream_Close(stream);
		stream = 0;
	}
	CString fullpath;
	fullpath = GetDocument()->GetPathName();
	if(fullpath == TEXT("")) // 경로가 없으면
	{
		MessageBox(TEXT("문서를 저장하시고 파일을 지정해주세요."));
		OnStop();
		return;
	}
	{
		TCHAR* tmp = new TCHAR[fullpath.GetLength()+1];
		_tcscpy(tmp, (const TCHAR*)fullpath);
		PathRemoveFileSpec(tmp);
		fullpath = tmp;
		delete [] tmp;
	}
	fullpath += TEXT("\\");
	TCHAR songfilename[256];
	GetDocument()->GetTextBox(songfilename, IDC_SONGFILE);
	if(_tcscmp(songfilename, TEXT("")) == 0)
		_tcscpy(songfilename, TEXT("song.mp3"));
	fullpath += songfilename;
// fmod 가 unicode 를 지원못함
#ifdef _UNICODE 
	char* fullpath2 = new char[fullpath.GetLength()*2+1];
	WideCharToMultiByte( CP_ACP, 0,  (const TCHAR*)fullpath,  -1, 
		fullpath2, fullpath.GetLength()*2+1 , 0, 0 );    
	stream = FSOUND_Stream_Open(fullpath2, FSOUND_NORMAL | FSOUND_MPEGACCURATE, 0, 0);
	delete [] fullpath2;
#else
	stream = FSOUND_Stream_Open(fullpath, FSOUND_NORMAL | FSOUND_MPEGACCURATE, 0, 0);
#endif
	if(stream)
	{
		SetTimer(0, 30, NULL);
		FSOUND_Stream_SetEndCallback(stream, endcallback, this);
		FSOUND_Stream_PlayEx(FSOUND_FREE, stream, NULL, FALSE);
	}
	else
	{
		MessageBox(TEXT("재생할 음악 파일이 없습니다."));
		
	}
}

void CKSFCreator2View::OnDestroy()
{
	CScrollView::OnDestroy();
	
	// TODO: Add your message handler code here
	if(FSOUND_Stream_GetOpenState(stream) == 0)
	{
		FSOUND_Stream_Close(stream);
		stream = 0;
	}
	KillTimer(0);
}

void CKSFCreator2View::OnTimer(UINT_PTR nIDEvent)
{
	// TODO: Add your message handler code here and/or call default
	if(nIDEvent == 0)
	{
		EndSel = GetDocument()->m_ksf.timeToIndex(FSOUND_Stream_GetTime(stream));
		if(EndSel > GetDocument()->m_ksf.getStepInfo().size()-1)
			EndSel = GetDocument()->m_ksf.getStepInfo().size()-1;
		BeginSel = EndSel;
		
		Invalidate(FALSE);
	}
	CScrollView::OnTimer(nIDEvent);
}

void CKSFCreator2View::OnStop()
{
	// TODO: Add your command handler code here
	KillTimer(0);
	if(FSOUND_Stream_GetOpenState(stream) == 0)
	{
		FSOUND_Stream_Close(stream);
		stream = 0;
	}
}

int CKSFCreator2View::getWidth(int h)
{
	RECT area;
	area.bottom = h;
	CKSFCreator2Doc* pDoc = GetDocument();
	int currenttick = pDoc->m_ksf.m_TickCount;
	double linecounter = 0;
	map<int, vector<tstring> >::const_iterator COP=pDoc->m_ksf.getChangeOfSpeed().begin();
	for(int row=0; row<pDoc->m_ksf.getStepInfo().size(); row++)
	{
		if(COP != pDoc->m_ksf.getChangeOfSpeed().end() && row == COP->first) // 해당줄에 변속 정보가 있을 경우엔
		{			
			for(int i=0; i<COP->second.size(); i++)
			{ // 변속정보를 정규식으로 해석함
				tmatch results;
				tregex expression;
				{ // Get Tick
					expression = TEXT("\\|T(\\d+)\\|");
					if(regex_match(COP->second[i], results, expression))
					{
						std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
						currenttick = _ttoi(tmp.c_str());
					}

					
					expression = TEXT("#TICKCOUNT:(\\d+);");
					if(std::tr1::regex_match(COP->second[i], results, expression))
					{
						std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
						currenttick = _ttoi(tmp.c_str());
					}
				}				
			}
			COP++;
		}
		linecounter += (double)1 / currenttick;
	}
	int addcol = 16;
	int addrow = 16;
	bool madistart = false;
	for(int line=0; line<linecounter; line++)
	{
		if(addrow > area.bottom-16*4*speedrate && madistart == true)
		{ // 주마디가 짤릴 경우 오른쪽으로 이동
			if(Double)
				addcol += 16*11;
			else
				addcol += 16*6;
			addrow = 16;
		}

		if((line+1) % 4 == 0)
			madistart = true;
		else
			madistart = false;
		addrow += 16 * speedrate;
	}
	if(Double)
		return addcol + 16*11;
	else
		return addcol + 16*6;
}

int CKSFCreator2View::getHeight()
{
	CKSFCreator2Doc* pDoc = GetDocument();
	int currenttick = pDoc->m_ksf.m_TickCount;

	map<int, vector<tstring> >::const_iterator COP=pDoc->m_ksf.getChangeOfSpeed().begin();
	double addrow = 0;
	for(int row=0; row<pDoc->m_ksf.getStepInfo().size(); row++)
	{
		TCHAR step[14];
		_tcscpy(step, pDoc->m_ksf.getStepInfo()[row].c_str());
		
		addrow += 16.f/currenttick*speedrate;
		if(COP != pDoc->m_ksf.getChangeOfSpeed().end() && row == COP->first)
		{			
			for(int i=0; i<COP->second.size(); i++)
			{
				std::tmatch results;
				std::tregex expression;
				{ // Get Tick
					expression = TEXT("\\|T(\\d+)\\|");
					if(regex_match(COP->second[i], results, expression))
					{
						std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
						currenttick = _ttoi(tmp.c_str());
					}

					expression = TEXT("#TICKCOUNT:(\\d+);");
					if(regex_match(COP->second[i], results, expression))
					{
						std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
						currenttick = _ttoi(tmp.c_str());
					}
				}				
			}
			COP++;
		}
	}
	return (int)addrow;
}


signed char F_CALLBACKAPI CKSFCreator2View::endcallback(FSOUND_STREAM *stream, void *buff, int len, void *param)
{
	CKSFCreator2View* pView = (CKSFCreator2View*)param;
	pView->KillTimer(0);
	if(FSOUND_Stream_GetOpenState(stream) == 0)
	{
		FSOUND_Stream_Close(stream);
		stream = 0;
	}
	return TRUE;
}

void CKSFCreator2View::makewhite()
{
	CClientDC dc(this);
	dc.SelectStockObject(WHITE_BRUSH);
	dc.SelectStockObject(WHITE_PEN);
	RECT area;
	GetClientRect(&area);
	dc.Rectangle(0, 0, getWidth(area.bottom), area.bottom);
}




HBITMAP CKSFCreator2View::MakeDIBSection(CDC* pDC, int width, int height)
{
	BITMAPINFO  bmi;
	LPVOID      pBits;
	HBITMAP     hBitmap;

	memset(&bmi.bmiHeader, 0, sizeof(BITMAPINFOHEADER));

	bmi.bmiHeader.biSize        = sizeof(BITMAPINFOHEADER);
	bmi.bmiHeader.biBitCount    = 24;                       // 칼라수  : 1, 4, 8, 16, 24, 31
	bmi.bmiHeader.biWidth       = width;       //비트맵 너비
	bmi.bmiHeader.biHeight      = height;      //비트매 높이
	bmi.bmiHeader.biPlanes      = 1;

	hBitmap = ::CreateDIBSection(pDC->GetSafeHdc(), &bmi, DIB_RGB_COLORS, (void **)&pBits, NULL, 0);
	return hBitmap;
}
void CKSFCreator2View::OnKsftopic()
{
	// TODO: Add your command handler code here
	KsfToPic ktp;
	ktp.pView = this;
	ktp.DoModal();
}




void CKSFCreator2View::drawLine(CDC& hMemDC, const std::set<int>& linelist, int height)
{
	CKSFCreator2Doc* pDoc = GetDocument();
	ASSERT_VALID(pDoc);
	if (!pDoc)
		return;

	RECT area;
	area.bottom = height;
	CPen* OldPen;
	OldPen = hMemDC.SelectObject(&Pen);	
	// 줄을 그림
	{
		int currenttick = pDoc->m_ksf.m_TickCount; // 현재 틱카운트

		map<int, int> linecounter2; // first 틱카의 노트가 second 만큼 있다는 뜻
		map<int, vector<tstring> >::const_iterator COP=pDoc->m_ksf.getChangeOfSpeed().begin(); // 변속변속
		int stepsize = pDoc->m_ksf.getStepInfo().size();
		for(int row=0; row<stepsize; row++)
		{
			if(COP != pDoc->m_ksf.getChangeOfSpeed().end() && row == COP->first) // 해당줄에 변속 정보가 있을 경우엔
			{
				for(int i=0; i<COP->second.size(); i++)
				{ // 변속정보를 정규식으로 해석함
					std::tmatch results;
					std::tregex expression;


					{ // Get Tick
						expression = TEXT("\\|T(\\d+)\\|");
						if(regex_match(COP->second[i], results, expression))
						{
							std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
							currenttick = _ttoi(tmp.c_str());
						}

						expression = TEXT("#TICKCOUNT:(\\d+);");
						if(regex_match(COP->second[i], results, expression))
						{
							std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
							currenttick = _ttoi(tmp.c_str());
						}
					}				
				}
				COP++;
			}
			linecounter2[currenttick]++;
		}

		double linecounter = 0; // 그려야하는 줄개수
		{
			int ra, rb;
			ra = 0;
			rb = 1;
			for(map<int, int>::iterator it=linecounter2.begin(); it != linecounter2.end(); it++)
			{
				int a, b, c, d;
				a = ra;
				b = rb;
				c = it->second;
				d = it->first;
				ra = a*d + b*c;
				rb = b*d;

				/*int gcd;
				{
				int u, v;
				u = ra;
				v = rb;
				int tmp;
				while(v)
				{
				tmp = u%v;
				u = v;
				v = tmp;
				}

				gcd = u;
				}
				ra /= gcd;
				rb /= gcd;*/
			}

			linecounter = (double)ra/(double)rb;
		}
		int addcol = 16;
		int addrow = 16*speedrate;
		bool madistart = false; // 주마디의 첫부분
		for(int line=0; line<linecounter; line++)
		{			
			if(!(addrow + 16*3*speedrate < area.bottom) && madistart == true)
			{ // 주마디가 짤릴 경우 오른쪽으로 이동
				if(Double)
					addcol += 16*11;
				else
					addcol += 16*6;
				addrow = 16*speedrate;
			}

			if((line+1) % 4 == 0) // 주마디부분 
			{
				hMemDC.SelectObject(Pen2);
				hMemDC.MoveTo(addcol, addrow);
				if(Double)
					hMemDC.LineTo(addcol + 16*10, addrow);
				else
					hMemDC.LineTo(addcol + 16*5, addrow);
				hMemDC.SelectObject(Pen);
				madistart = true;
				//linelist.insert(addrow);
			}
			else
			{
				hMemDC.MoveTo(addcol, addrow);
				if(Double)
					hMemDC.LineTo(addcol + 16*10, addrow);
				else
					hMemDC.LineTo(addcol + 16*5, addrow);
				madistart = false;
			}

			addrow += 16 * speedrate;
		}
	}

	hMemDC.SelectObject(OldPen);
}

void CKSFCreator2View::drawBackFromVariableSpeed(CDC& hMemDC, const std::vector<POINT>& stepposlist)
{
	CKSFCreator2Doc* pDoc = GetDocument();
	ASSERT_VALID(pDoc);
	if (!pDoc)
		return;

	CBrush* OldBrush;
	CPen* OldPen;
	OldBrush = hMemDC.SelectObject(&Brush2);
	OldPen = hMemDC.SelectObject(&Pen3);
	int stepsize = pDoc->m_ksf.getStepInfo().size();
	if(Double)
	{ // stepposlist 를 통해서 변속영역그리기
		for(int row=0; row<stepsize; row++)
		{
			//변속 정보가 있으면
			if(pDoc->m_ksf.getChangeOfSpeed().find(row) != pDoc->m_ksf.getChangeOfSpeed().end()) 
				hMemDC.Rectangle(16 + stepposlist[row].x, 
				stepposlist[row].y, 
				16 + stepposlist[row].x + 16*10,
				stepposlist[row].y + 16);
		}
	}
	else
	{ // stepposlist 를 통해서 변속영역그리기
		for(int row=0; row<stepsize; row++)
		{
			//변속 정보가 있으면
			if(pDoc->m_ksf.getChangeOfSpeed().find(row) != pDoc->m_ksf.getChangeOfSpeed().end()) 
				hMemDC.Rectangle(16 + stepposlist[row].x, 
				stepposlist[row].y, 
				16 + stepposlist[row].x + 16*5,
				stepposlist[row].y + 16);
		}
	}	
	hMemDC.SelectObject(OldBrush);
	hMemDC.SelectObject(OldPen);
}

void CKSFCreator2View::drawBack(CDC& hMemDC, const std::vector<POINT>& stepposlist)
{
	CKSFCreator2Doc* pDoc = GetDocument();
	ASSERT_VALID(pDoc);
	if (!pDoc)
		return;

	CBrush* OldBrush;
	CPen* OldPen;

	OldBrush = hMemDC.SelectObject(&Brush);
	OldPen = hMemDC.SelectObject(&Pen);
	int CopyBeginSel = BeginSel;
	int CopyEndSel = EndSel;

	if(CopyBeginSel > CopyEndSel)
	{
		int tmp = CopyBeginSel;
		CopyBeginSel = CopyEndSel;
		CopyEndSel = tmp;
	}

	unsigned int multiplier = Double ? 10 : 5;
	// stepposlist 를 통해서 선택영역그리기
	for(int select=CopyBeginSel; select<=CopyEndSel; select++)
	{
		hMemDC.Rectangle(16 + stepposlist[select].x, 
			stepposlist[select].y, 
			16 + stepposlist[select].x + 16*multiplier,
			stepposlist[select].y + 16);
	}
	hMemDC.SelectObject(OldBrush);
	hMemDC.SelectObject(OldPen);
}

void CKSFCreator2View::drawVariableSpeed(CDC& hMemDC, const std::vector<POINT>& stepposlist)
{
	CKSFCreator2Doc* pDoc = GetDocument();
	ASSERT_VALID(pDoc);
	if (!pDoc)
		return;

	CDC CopDC;
	CDC Cop2DC;	
	CopDC.CreateCompatibleDC(&hMemDC);
	Cop2DC.CreateCompatibleDC(&hMemDC);
	CBitmap* pCop = (CBitmap*)CopDC.SelectObject(&COPImg);
	CBitmap* pCop2 = (CBitmap*)Cop2DC.SelectObject(&COP2Img);
	map<int, vector<tstring> >::const_iterator COP=pDoc->m_ksf.getChangeOfSpeed().begin();
	for(map<int, vector<tstring> >::const_iterator COP=pDoc->m_ksf.getChangeOfSpeed().begin();
		COP!=pDoc->m_ksf.getChangeOfSpeed().end(); COP++)
	{
		POINT org = stepposlist[COP->first];
		if(COP->first == EndSel)
		{
			hMemDC.TransparentBlt(org.x, org.y, 16, 16, 
				&Cop2DC, 0, 0, 16, 16, RGB(0xff, 0xff, 0xff));
		}
		else
		{
			hMemDC.TransparentBlt(org.x, org.y, 16, 16, 
				&CopDC, 0, 0, 16, 16, RGB(0xff, 0xff, 0xff));
		}
	}
	CopDC.SelectObject(pCop);
	CopDC.DeleteDC();
	Cop2DC.SelectObject(pCop);
	Cop2DC.DeleteDC();
}

void CKSFCreator2View::drawNote(CDC& hMemDC, const std::vector<POINT>& stepposlist)
{
	CKSFCreator2Doc* pDoc = GetDocument();
	ASSERT_VALID(pDoc);
	if (!pDoc)
		return;
	
	CDC ArrowDC;
	ArrowDC.CreateCompatibleDC(&hMemDC);	
	CBitmap* pArrow = (CBitmap*)ArrowDC.SelectObject(&ArrowImg);
	
	// // stepposlist 를 통해서 노트 그리기
	std::vector<POINT> firstlongnote;
	std::vector<POINT> firstlongnotesrc;

	int stepposlistsize = stepposlist.size();
	for(int loop=0; loop<stepposlistsize; loop++)
	{
		POINT org = stepposlist[loop];
		TCHAR step[14];
		_tcscpy(step, pDoc->m_ksf.getStepInfo()[loop].c_str()); // 해당줄에 대한 스텝 정보를 얻어옴
		unsigned int multiplier = Double ? 10 : 5;
		// 노트를 그림
		for(int j=0; j<multiplier; j++)
		{				
			if(step[j] == '1')
			{
				hMemDC.TransparentBlt(org.x + 16 +  j*16, org.y, 16, 16, 
					&ArrowDC, (j%5)*16, 0, 16, 16, RGB(0xff, 0xff, 0xff));
			}
			else if(step[j] == '4')
			{
				int longnote = 2;
				if(loop != 0)
				{
					TCHAR step[14];
					_tcscpy(step, pDoc->m_ksf.getStepInfo()[loop-1].c_str()); // 해당줄에 대한 스텝 정보를 얻어옴
					if(step[j] != '4')
						longnote = 1;					
				}
				if(loop != stepposlistsize - 1)
				{
					TCHAR step[14];
					_tcscpy(step, pDoc->m_ksf.getStepInfo()[loop+1].c_str()); // 해당줄에 대한 스텝 정보를 얻어옴
					if(step[j] != '4')
						longnote = 3;
				}
				int longnotex;
				int longnotey;
				if(longnote == 1)			longnotey = 16;
				else if(longnote == 2)		longnotey = 48;
				else if(longnote == 3)		longnotey = 32;

				if(j == 0 || j == 5)		longnotex = 0;
				else if(j == 4 || j == 9)	longnotex = 64;
				else if(j == 2 || j == 7)	longnotex = 32;
				else if(j == 1 || j == 6)	longnotex = 16;
				else if(j == 3 || j == 8)	longnotex = 48;

				if(longnote == 1)
				{
					POINT tmp;
					tmp.x = org.x + 16 + j*16;
					tmp.y = org.y;
					firstlongnote.push_back(tmp);
					tmp.x = longnotex;
					tmp.y = longnotey;
					firstlongnotesrc.push_back(tmp);
				}
				hMemDC.TransparentBlt(org.x + 16 + j*16, org.y, 16, 16, 
					&ArrowDC, longnotex, longnotey, 16, 16, RGB(0xff, 0xff, 0xff));
			}
		}		
	}
	int longnotenumber = firstlongnote.size();
	for(int loop=0; loop<longnotenumber; loop++)
	{
		hMemDC.TransparentBlt(firstlongnote[loop].x, firstlongnote[loop].y, 16, 16, 
			&ArrowDC, firstlongnotesrc[loop].x, firstlongnotesrc[loop].y, 16, 16, RGB(0xff, 0xff, 0xff));
	}
	ArrowDC.SelectObject(pArrow);
	ArrowDC.DeleteDC();
}

void CKSFCreator2View::drawWhite(CDC& hMemDC, int height)
{
	hMemDC.SelectStockObject(WHITE_BRUSH);
	hMemDC.SelectStockObject(WHITE_PEN);
	hMemDC.Rectangle(0, 0, getWidth(height), height);
}

bool CKSFCreator2View::adjustLineData(std::set<int>& linelist, std::vector<POINT>& stepposlist, int height)
{
	CKSFCreator2Doc* pDoc = GetDocument();
	ASSERT_VALID(pDoc);
	if (!pDoc)
		return false;	
	{ // linelist
		for(int i=1; 16*4*speedrate*i < height; i++)
		{
			linelist.insert(16*4*speedrate*i);
		}		
	}
	{ // stepposlist
		int currenttick = pDoc->m_ksf.m_TickCount;

		map<int, vector<tstring> >::const_iterator COP=pDoc->m_ksf.getChangeOfSpeed().begin();
		double addrow = 0;
		int addcol = 0;
		int stepsize = pDoc->m_ksf.getStepInfo().size();
		if(linelist.empty()) return false;
		int maxelementline = *max_element(linelist.begin(), linelist.end());
		for(int row=0; row<stepsize; row++)
		{
			if(linelist.empty() == false)
			{
				// 주마디가 짤릴 경우 오른쪽으로 이동
				if(addrow > maxelementline)
				{ // 마지막 줄을 넘어갈 경우
					addrow = addrow - maxelementline;
					if(Double)
						addcol += 16*11;
					else
						addcol += 16*6;
				}
				else if(addrow == maxelementline)
				{ // 마지막 줄에 딱 걸칠 때
					addrow = 0;
					if(Double)
						addcol += 16*11;
					else
						addcol += 16*6;
				}
			}
			if(COP != pDoc->m_ksf.getChangeOfSpeed().end() && row == COP->first) // 해당줄에 변속 정보가 있을 경우엔
			{			
				for(int i=0; i<COP->second.size(); i++)
				{ // 변속정보를 정규식으로 해석함
					std::tmatch results;
					std::tregex expression;


					{ // Get Tick
						expression = TEXT("\\|T(\\d+)\\|");
						if(regex_match(COP->second[i], results, expression))
						{
							std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
							currenttick = _ttoi(tmp.c_str());
						}

						expression = TEXT("#TICKCOUNT:(\\d+);");
						if(regex_match(COP->second[i], results, expression))
						{
							std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
							currenttick = _ttoi(tmp.c_str());
						}
					}				
				}
				COP++;
			}
			
			POINT tmp;
			tmp.x = addcol;
			tmp.y = addrow;
			stepposlist.push_back(tmp);
			addrow += 16.f/currenttick*speedrate; // 다음그릴 줄 계산
		}
	}

	return true;
}

void CKSFCreator2View::CreatePic(const TCHAR* path, unsigned int height, unsigned int speed)
{
	int backupspeed = speedrate;
	speedrate = speed;
	CClientDC dc(this);
	CBitmap hBit;
	//CreateCompatibleBitmap 으로 생성한 비트맵이 더 빠르지만 실패할 경우 MakeDIBSection 으로 대체함.
	if(!hBit.CreateCompatibleBitmap(&dc, getWidth(height), height))
	{
		hBit.Attach(MakeDIBSection(&dc, getWidth(height), height));
	}
	
	CDC hMemDC;
	hMemDC.CreateCompatibleDC(&dc);
	CBitmap* OldBitmap = hMemDC.SelectObject(&hBit);

	drawWhite(hMemDC, height);

	std::set<int> linelist; // 주마디선이 그이는 y 좌표
	std::vector<POINT> stepposlist;
	if(adjustLineData(linelist, stepposlist, height) == true)
	{
		//drawLine(hMemDC, linelist, height);
		//drawBackFromVariableSpeed(hMemDC, stepposlist);
		//drawVariableSpeed(hMemDC, stepposlist);
		//drawNote(hMemDC, stepposlist);
		/////////////////////////////
		////CxImage test;
		//CxImage ci;
		//ci.CreateFromHBITMAP(hBit);
		//CxImage ciText;
		//{
		//	CBitmap hBit2;
		//	CDC dc2;
		//	hBit2.CreateCompatibleBitmap(&dc, 600, 20);
		//	dc2.CreateCompatibleDC(&dc);
		//	
		//	CBitmap* OldBitmap = dc2.SelectObject(&hBit2);
		//	dc2.FillSolidRect(0, 0, 600, 20, RGB(0xff, 0xff, 0xff));
		//	tstring display;
		//	TCHAR szSpeed[5];
		//	_itot(speed, szSpeed, 10);
		//	
		//	display += GetDocument()->m_ksf.m_Title + TEXT(" ");
		//	display += GetDocument()->m_ksf.m_BPM1 + TEXT(" BPM ");
		//	display += szSpeed;
		//	display += TEXT("배속");
		//	dc2.TextOut(0, 0, display.c_str(), display.size());
		//	
		//	ciText.Clear(0xff);
		//	ciText.CreateFromHBITMAP(hBit2);
		//	dc2.SelectObject(OldBitmap);
		//	dc2.DeleteDC();
		//	hBit2.DeleteObject();
		//}
		//CxImage result;
		//result.Create(ci.GetWidth(), ci.GetHeight()+20, 24);
		//result.Clear(0xff);
		//result.Mix(ci, CxImage::ImageOpType::OpAnd, 0, 0, false);
		//result.Mix(ciText, CxImage::ImageOpType::OpAnd, 0, -result.GetHeight()+20, false);
		//result.Save(path, CXIMAGE_FORMAT_PNG);
	}
	else
		MessageBox(TEXT("세로값이 너무 작습니다."));
	
	hMemDC.SelectObject(OldBitmap);
	hMemDC.DeleteDC();
	speedrate = backupspeed;
}

void CKSFCreator2View::OnRButtonUp(UINT nFlags, CPoint point)
{
	// TODO: Add your message handler code here and/or call default
	CPoint curpos;
	GetCursorPos(&curpos);
	CMenu menu;
	menu.LoadMenu(IDR_KSFCreator2TYPE);
	CMenu* pmenu = menu.GetSubMenu(1);
	pmenu->TrackPopupMenu(TPM_LEFTALIGN|TPM_RIGHTBUTTON, 
		curpos.x, curpos.y, this);
	CScrollView::OnRButtonUp(nFlags, point);
}
