
#include "stdafx.h"
#include "ksfinfo.h"

#include <algorithm>
#include <regex> 
#include <locale.h>

ksfinfo::ksfinfo()
{
	//boost::regex_grep(
	m_Title = TEXT("New KSF");
	m_Player = TEXT("SINGLE");
	m_BPM1 = TEXT("120.00");
	m_StartTime1 = 0;
	m_TickCount = 4; //1,2,3,4,5,6,7,8	
	m_IntroFile = TEXT("");
	m_SongFile = TEXT("");
	m_DiscFile = TEXT("");
	m_TitleFile = TEXT("");
	m_Difficulty = -1;
	m_BPM2 = TEXT("");
	m_BPM3 = TEXT("");
	m_BunKi1 = -1;
	m_BunKi2 = -1;
	m_StartTime2 = -1;
	m_StartTime3 = -1;
	stepdata.m_StepInfo.push_back(TEXT("0000000000000"));

	setlocale(LC_ALL, "Korean"); 
}
ksfinfo::~ksfinfo()
{
}

BOOL ksfinfo::LoadKSF(const TCHAR* path)
{
	
	std::tstring str;
	{
		FILE* fp = _tfopen(path, TEXT("rt"));
		TCHAR text[256];
		
		while(_fgetts(text, 256, fp) != NULL)
		{
			str += text;
		}
		fclose(fp);
	}
	stepdata.m_StepInfo.erase(stepdata.m_StepInfo.begin(), stepdata.m_StepInfo.end());

	
	tmatch results;
	tregex expression;

	//KSF 유효성 검사 ([0124]{13} 로 하면 입력값이 [0124]{12} 일 경우 에러를 뱉기 때문에 저렇게 처리 ㅡㅡ;)
	
	expression = TEXT("\\n*(^(#TITLE|#PLAYER|#BPM|#STARTTIME|#TICKCOUNT|#INTROFILE|#TITLEFILE|#SONGFILE|#DISCFILE|#DIFFICULTY):.*;\\n*)+^#STEP:\\n+^(([0124]{13}|(\\|[BTDE](([0-9]+\\.[0-9]*)|([0-9]*\\.[0-9]+)|([0-9]+))\\|)|(#(BPM|TICKCOUNT|DELAY|DELAYBEAT):(([0-9]+\\.[0-9]*)|([0-9]*\\.[0-9]+)|([0-9]+));))\\n|$)+");//#STEP:\\n+(^([0124]{13}|^#(BPM|TICKCOUNT|DELAY|DELAYBEAT):\\d+\\.?\\d+;)\\n+)+");

	if(regex_match(str, expression) == FALSE)
		return FALSE;

	getFromRegExp(m_Title, str, results, TEXT("^#TITLE:(.*);"));
    getFromRegExp(m_Player, str, results, TEXT("^#PLAYER:(.*);"));
	getFromRegExp(m_BPM1, str, results, TEXT("^#BPM:(.*);"));
	getFromRegExp(m_StartTime1, str, results, TEXT("^#STARTTIME:(.*);"));
	getFromRegExp(m_TickCount, str, results, TEXT("^#TICKCOUNT:(.*);"));
	getFromRegExp(m_IntroFile, str, results, TEXT("^#INTROFILE:(.*);"));
	getFromRegExp(m_TitleFile, str, results, TEXT("^#TITLEFILE:(.*);"));
	getFromRegExp(m_SongFile, str, results, TEXT("^#SONGFILE:(.*);"));
	getFromRegExp(m_DiscFile, str, results, TEXT("^#DISCFILE:(.*);"));
	getFromRegExp(m_Difficulty, str, results, TEXT("^#DIFFICULTY:(.*);"));

	expression = TEXT("^#STEP:([.\\n]+)");
	if(std::tr1::regex_search(str, results, expression))
	{
		std::tstring match(results[1].first._Ptr);
		TCHAR* data = new TCHAR[match.size()+1];
		_tcscpy(data, match.c_str());
		TCHAR* text = _tcstok(data, TEXT("\n"));
		if(text)
		{
			if(text[0] == '|' || text[0] == '#') // 변속 관련 플래그 // change of speed
				stepdata.m_ChangeOfSpeed[stepdata.m_StepInfo.size()].push_back(text);
			else if(text[0] == '2') {}// exit
			else  // note
				stepdata.m_StepInfo.push_back(text);
		}		
		while(text!=0)
		{
			text = _tcstok(0, TEXT("\n"));
			if(text)
			{
				if(text[0] == '|' || text[0] == '#') // 변속 관련 플래그 // change of speed
					stepdata.m_ChangeOfSpeed[stepdata.m_StepInfo.size()].push_back(text);
				else if(text[0] == '2') {}// exit
				else  // note
					stepdata.m_StepInfo.push_back(text);
			}
		}
		delete [] data;
	}
	
	return TRUE;
}


void ksfinfo::SetStep(bool doublemode, int position, int beginsel, int endsel)
{ 	
	// position 은 
	if(doublemode)
	{
		if(beginsel != endsel)
		{
			if(endsel < beginsel)
			{
				int t = beginsel;
				beginsel = endsel;
				endsel = t;
			}
			for(int t=beginsel; t<=endsel; t++)
				stepdata.m_StepInfo[t][position] = '4';
		}
		else
		{
			if(stepdata.m_StepInfo[beginsel][position] == '0')
				stepdata.m_StepInfo[beginsel][position] = '1';
			else
				stepdata.m_StepInfo[beginsel][position] = '0';
		}
	}
	else
	{
		if(beginsel != endsel)
		{
			if(endsel < beginsel)
			{
				int t = beginsel;
				beginsel = endsel;
				endsel = t;
			}
			for(int t=beginsel; t<=endsel; t++)
				stepdata.m_StepInfo[t][position] = '4';
		}
		else
		{
			if(stepdata.m_StepInfo[beginsel][position] == '0')
				stepdata.m_StepInfo[beginsel][position] = '1';
			else
				stepdata.m_StepInfo[beginsel][position] = '0';
		}
	}
	unredo.saveHistory(stepdata);
}

BOOL ksfinfo::SaveKSF(const TCHAR* path)
{
	FILE* fp = _tfopen(path, TEXT("w"));
	
/*
	
새로운 다무에서 지원하는 변속방법
#TICKCOUNT: 정수; (또는 |T정수|) 
	헤더 부분의 #TICKCOUNT 값을 바꾼다. 
#BPM: 실수; (또는 |B실수|) 
		변속을 나타내며, 해당 위치에서 BPM 값을 변경한다. 
#DELAY: 정수; (또는 |D정수|) 
		해당 위치에서 오브젝트가 올라오는 것을 지정한 시간(1/1000초 단위)만큼 중단한다. 
#DELAYBEAT: 정수; (또는 |E정수|) 
		해당 위치에서 오브젝트가 올라오는 것을 지정한 시간(1마디 단위)만큼 중단한다. 
;*/
	_ftprintf(fp, TEXT("#TITLE:%s;\n"), m_Title.c_str());
	_ftprintf(fp, TEXT("#BPM:%s;\n"), m_BPM1.c_str());
	_ftprintf(fp, TEXT("#STARTTIME:%d;\n"), m_StartTime1);
	_ftprintf(fp, TEXT("#PLAYER:%s;\n"), m_Player.c_str());
	_ftprintf(fp, TEXT("#TICKCOUNT:%d;\n"), m_TickCount);
	if(m_IntroFile != TEXT(""))
		_ftprintf(fp, TEXT("#INTROFILE:%s;\n"), m_IntroFile.c_str());
	if(m_SongFile != TEXT(""))
		_ftprintf(fp, TEXT("#SONGFILE:%s;\n"), m_SongFile.c_str());
	if(m_DiscFile != TEXT(""))
		_ftprintf(fp, TEXT("#DISCFILE:%s;\n"), m_DiscFile.c_str());
	if(m_TitleFile != TEXT(""))
		_ftprintf(fp, TEXT("#TITLEFILE:%s;\n"), m_TitleFile.c_str());
	if(m_Difficulty >= 0)
		_ftprintf(fp, TEXT("#DIFFICULTY:%d;\n"), m_Difficulty);
	if(m_BPM2 != TEXT(""))
		_ftprintf(fp, TEXT("#BPM2:%s;\n"), m_BPM2.c_str());
	if(m_BPM3 != TEXT(""))
		_ftprintf(fp, TEXT("#BPM3:%s;\n"), m_BPM3.c_str());
	if(m_BunKi1 >= 0)
		_ftprintf(fp, TEXT("#BUNKI:%d;\n"), m_BunKi1);
	if(m_BunKi2 >= 0)
		_ftprintf(fp, TEXT("#BUNKI2:%d;\n"), m_BunKi2);
	if(m_StartTime2 >= 0)
		_ftprintf(fp, TEXT("#STARTTIME2:%d;\n"), m_StartTime2);
	if(m_StartTime3 >= 0)
		_ftprintf(fp, TEXT("#STARTTIME3:%d;\n"), m_StartTime3);
	_ftprintf(fp, TEXT("#STEP:\n"));

	//변속 iterator
	map<int, vector<tstring> >::const_iterator cop = stepdata.m_ChangeOfSpeed.begin();

	// 스텝 파일 검색
	for(int i=0; i<stepdata.m_StepInfo.size(); i++) 
	{
		// 해당 자리에 변속이 있으면
		if(cop != stepdata.m_ChangeOfSpeed.end() && cop->first == i) 
		{
			//변속 내용 쓰기
			for(int j=0; j<cop->second.size(); j++)
			{
				_ftprintf(fp, TEXT("%s\n"), cop->second[j].c_str());
			}
			cop++;
		}
		_ftprintf(fp, TEXT("%s\n"), stepdata.m_StepInfo[i].c_str());
	}
	//혹시 스텝파일을 지나서 변속이 있으면
	if(cop != stepdata.m_ChangeOfSpeed.end())
	{
		//나머지 변속 내용을 씀.
		for(int j=0; j<cop->second.size(); j++)
		{
			_ftprintf(fp, TEXT("%s\n"), cop->second[j].c_str());
		}
	}
	_ftprintf(fp, TEXT("2222222222222"));
	fclose(fp);
	return TRUE;
}


void ksfinfo::Rotation(int player, int rotation, int s, int e)
{
	// player = 0 : 1p
	// player = 1 : 2p
	// player = 2 : double

	// rotation = 0 : 가로 대칭
	// rotation = 1 : 세로 대칭
	// rotation = 2 : +90
	// rotation = 3 : -90
	// rotation = 4 : 미러
	for(int i=s; i<=e; i++)
	{
		if(player == 0)
		{
			if(rotation == 0)
			{
				swap(stepdata.m_StepInfo[i][0], stepdata.m_StepInfo[i][4]);
				swap(stepdata.m_StepInfo[i][1],stepdata.m_StepInfo[i][3]);
			}
			else if(rotation == 1)
			{
				swap(stepdata.m_StepInfo[i][0], stepdata.m_StepInfo[i][1]);
				swap(stepdata.m_StepInfo[i][3], stepdata.m_StepInfo[i][4]);
			}
			else if(rotation == 2)
			{
				TCHAR backup = stepdata.m_StepInfo[i][1];
				stepdata.m_StepInfo[i][1] = stepdata.m_StepInfo[i][3];
				stepdata.m_StepInfo[i][3] = stepdata.m_StepInfo[i][4];
				stepdata.m_StepInfo[i][4] = stepdata.m_StepInfo[i][0];
				stepdata.m_StepInfo[i][0] = backup;
			}
			else if(rotation == 3)
			{
				TCHAR backup = stepdata.m_StepInfo[i][3];
				stepdata.m_StepInfo[i][3] = stepdata.m_StepInfo[i][1];
				stepdata.m_StepInfo[i][1] = stepdata.m_StepInfo[i][0];
				stepdata.m_StepInfo[i][0] = stepdata.m_StepInfo[i][4];
				stepdata.m_StepInfo[i][4] = backup;
			}
			else if(rotation == 4)
			{
				// 가로대칭
				swap(stepdata.m_StepInfo[i][0], stepdata.m_StepInfo[i][4]);
				swap(stepdata.m_StepInfo[i][1],stepdata.m_StepInfo[i][3]);

				//세로 대칭
				swap(stepdata.m_StepInfo[i][0], stepdata.m_StepInfo[i][1]);
				swap(stepdata.m_StepInfo[i][3], stepdata.m_StepInfo[i][4]);
			}
		}
		else if(player == 1)
		{
			if(rotation == 0)
			{
				swap(stepdata.m_StepInfo[i][5], stepdata.m_StepInfo[i][9]);
				swap(stepdata.m_StepInfo[i][6], stepdata.m_StepInfo[i][8]);
			}
			else if(rotation == 1)
			{
				swap(stepdata.m_StepInfo[i][5], stepdata.m_StepInfo[i][6]);
				swap(stepdata.m_StepInfo[i][8], stepdata.m_StepInfo[i][9]);
			}
			else if(rotation == 2)
			{
				TCHAR backup = stepdata.m_StepInfo[i][6];
				stepdata.m_StepInfo[i][6] = stepdata.m_StepInfo[i][8];
				stepdata.m_StepInfo[i][8] = stepdata.m_StepInfo[i][9];
				stepdata.m_StepInfo[i][9] = stepdata.m_StepInfo[i][5];
				stepdata.m_StepInfo[i][5] = backup;
			}
			else if(rotation == 3)
			{
				TCHAR backup = stepdata.m_StepInfo[i][8];
				stepdata.m_StepInfo[i][8] = stepdata.m_StepInfo[i][6];
				stepdata.m_StepInfo[i][6] = stepdata.m_StepInfo[i][5];
				stepdata.m_StepInfo[i][5] = stepdata.m_StepInfo[i][9];
				stepdata.m_StepInfo[i][9] = backup;
			}
			else if(rotation == 4)
			{
				// 가로대칭
				swap(stepdata.m_StepInfo[i][5], stepdata.m_StepInfo[i][9]);
				swap(stepdata.m_StepInfo[i][6], stepdata.m_StepInfo[i][8]);

				// 세로 대칭
				swap(stepdata.m_StepInfo[i][5], stepdata.m_StepInfo[i][6]);
				swap(stepdata.m_StepInfo[i][8], stepdata.m_StepInfo[i][9]);
			}
		}
		else if(player == 2)
		{
			if(rotation == 0)
			{
				swap(stepdata.m_StepInfo[i][0], stepdata.m_StepInfo[i][9]);
				swap(stepdata.m_StepInfo[i][4],stepdata.m_StepInfo[i][5]);
				swap(stepdata.m_StepInfo[i][1],stepdata.m_StepInfo[i][8]);
				swap(stepdata.m_StepInfo[i][3],stepdata.m_StepInfo[i][6]);
				swap(stepdata.m_StepInfo[i][2],stepdata.m_StepInfo[i][7]);
			}
			else if(rotation == 1)
			{
				swap(stepdata.m_StepInfo[i][0], stepdata.m_StepInfo[i][1]);
				swap(stepdata.m_StepInfo[i][3],stepdata.m_StepInfo[i][4]);
				swap(stepdata.m_StepInfo[i][5],stepdata.m_StepInfo[i][6]);
				swap(stepdata.m_StepInfo[i][8],stepdata.m_StepInfo[i][9]);
			}
			else if(rotation == 2 || rotation == 3)
			{ // 있을 수 없음.
			}
			else if(rotation == 4)
			{
				// 가로 대칭
				swap(stepdata.m_StepInfo[i][0], stepdata.m_StepInfo[i][9]);
				swap(stepdata.m_StepInfo[i][4],stepdata.m_StepInfo[i][5]);
				swap(stepdata.m_StepInfo[i][1],stepdata.m_StepInfo[i][8]);
				swap(stepdata.m_StepInfo[i][3],stepdata.m_StepInfo[i][6]);
				swap(stepdata.m_StepInfo[i][2],stepdata.m_StepInfo[i][7]);

				// 세로 대칭
				swap(stepdata.m_StepInfo[i][0], stepdata.m_StepInfo[i][1]);
				swap(stepdata.m_StepInfo[i][3],stepdata.m_StepInfo[i][4]);
				swap(stepdata.m_StepInfo[i][5],stepdata.m_StepInfo[i][6]);
				swap(stepdata.m_StepInfo[i][8],stepdata.m_StepInfo[i][9]);
			}
		}
	}

	unredo.saveHistory(stepdata);
}

void ksfinfo::Insert(int e, int size)
{
	if(size == 0)
		size = 1;
	for(int i=0; i<size; i++)
		stepdata.m_StepInfo.insert(stepdata.m_StepInfo.begin()+e, 
			TEXT("0000000000000"));
	if(stepdata.m_ChangeOfSpeed.empty() == FALSE)
	{
		map<int, vector<tstring> >::iterator i=stepdata.m_ChangeOfSpeed.end();
		i--;
		while(1)
		{
			if(i->first < e)
				break;
			stepdata.m_ChangeOfSpeed[i->first+1] = i->second;
			if(i == stepdata.m_ChangeOfSpeed.begin())
			{
				stepdata.m_ChangeOfSpeed.erase(i);
				break;
			}
			map<int, vector<tstring> >::iterator p = i;
			i--;
			stepdata.m_ChangeOfSpeed.erase(p);		
		}
	}
	unredo.saveHistory(stepdata);
}

void ksfinfo::IncCosFrom(int endsel)
{
	if(stepdata.m_ChangeOfSpeed.empty() == FALSE)
	{
		map<int, vector<tstring> >::iterator i=stepdata.m_ChangeOfSpeed.end();
		i--;
		while(endsel <= i->first) // 자기위치 <= i 인 경우
		{
			stepdata.m_ChangeOfSpeed[i->first+1] = i->second; // 땡김
			if(i == stepdata.m_ChangeOfSpeed.begin()) // 처음 변속이라는 예외
			{
				stepdata.m_ChangeOfSpeed.erase(i);
				break;
			}
			map<int, vector<tstring> >::iterator p = i; // 백업
			i--; // 감소
			stepdata.m_ChangeOfSpeed.erase(p); // 백업한거 삭제
		}
	}

	this->IncCosFrom(endsel);
}

void ksfinfo::Pushback(int size)
{
	if(size == 0)
		size = 1;
	for(int i=0; i<size; i++)
		stepdata.m_StepInfo.push_back(TEXT("0000000000000"));

	unredo.saveHistory(stepdata);
}

void ksfinfo::Remove(int bs, int es)
{
	
	if(stepdata.m_StepInfo.size() == 1)
		return; // 스텝이 없으면 더 이상 삭제하지 않는다.

	//bs 와 es 사이에 있는 키값은 모조리 삭제하고 
	//키값이 es 보다 크면 (es-bs+1) 만큼 키값 감소
	
	map<int, vector<tstring> >::iterator loop=stepdata.m_ChangeOfSpeed.begin();
	for(;loop != stepdata.m_ChangeOfSpeed.end(); loop++) // es 바로 뒤 요소찾기
	{
		if(loop->first > es)
			break;
	}
	map<int, vector<tstring> >::iterator cop = loop;
	for(int i=bs; i<=es; i++)
	{
		stepdata.m_StepInfo.erase(stepdata.m_StepInfo.begin() + bs);
		map<int, vector<tstring> >::iterator f = stepdata.m_ChangeOfSpeed.find(i);
		if(f != stepdata.m_ChangeOfSpeed.end()) // 찾았다
			stepdata.m_ChangeOfSpeed.erase(f);
	}
	
	
	
	for(;cop != stepdata.m_ChangeOfSpeed.end(); )
	{
		stepdata.m_ChangeOfSpeed[cop->first - (es-bs+1)] = cop->second;
		map<int, vector<tstring> >::iterator t=cop;
		cop++;
		stepdata.m_ChangeOfSpeed.erase(t);
	}

	unredo.saveHistory(stepdata);
}

int ksfinfo::InputTextInfo(const TCHAR* data, int e)
{
	
	TCHAR* datacopy = new TCHAR[_tcslen(data)+1];
	_tcscpy(datacopy, data);
	TCHAR* pd;
	std::vector<std::tstring> buf;
	pd = _tcstok(datacopy, TEXT("\r\n"));

	if(pd)
	{
		if(pd[0] == '|' || pd[0] == '#') // 변속 관련 플래그 // change of speed 
			stepdata.m_ChangeOfSpeed[buf.size()+e].push_back(pd);
		else if(pd[0] == '2'){}
		else  // note
			buf.push_back(pd);
	}
	while(pd)
	{
		pd = _tcstok(0, TEXT("\r\n"));
		if(pd)
		{
			if(pd[0] == '|' || pd[0] == '#') // 변속 관련 플래그 // change of speed
				stepdata.m_ChangeOfSpeed[buf.size()+e].push_back(pd);
			else if(pd[0] == '2') {}// exit
			else  // note
				buf.push_back(pd);
		}
	}
	std::vector<std::tstring>::iterator it = stepdata.m_StepInfo.begin();
	int q;
	for(q=0; q<e; q++)
		it++;
	stepdata.m_StepInfo.insert(it, buf.begin(), buf.end());
	delete [] datacopy;
	unredo.saveHistory(stepdata);
	return	q+buf.size();
}

void ksfinfo::ChangeCos(int steppos, tstring str)
{		
	
	if(str == TEXT(""))
	{
		stepdata.m_ChangeOfSpeed.erase(steppos);
	}
	else
	{
		TCHAR* _str = new TCHAR[str.size()+1];
		_tcscpy(_str, str.c_str());
		TCHAR* p = _tcstok(_str, TEXT("\r\n"));

		vector<tstring> v;
		if(p) v.push_back(p);
		while(p)
		{
			p = _tcstok(NULL, TEXT("\r\n"));
			if(p)
				v.push_back(p);
		}
		stepdata.m_ChangeOfSpeed[steppos] = v;

		delete _str;
	}
	unredo.saveHistory(stepdata);
}

void ksfinfo::setStepData(const StepData* sd)
{
	if(sd)
		stepdata = *sd;
}

void ksfinfo::setSpace(int rangeS, int rangeE, bool Double, unsigned int spacevalue)
{
	vector<tstring> steps;
	if(Double)
	{
		for(int loop=rangeS; loop<=rangeE; loop++)
		{
			TCHAR step[14];
			_tcscpy(step, stepdata.m_StepInfo[loop].c_str()); // 해당줄에 대한 스텝 정보를 얻어옴
			bool empty = true;
			for(int i=0; i<14; i++)
			{
				if(step[i] != '0')
				{
					empty = false;
					break;
				}
			}
			if(!empty)
				steps.push_back(step);
		}
	}
	else
	{
		for(int loop=rangeS; loop<=rangeE; loop++)
		{
			TCHAR step[14];
			_tcscpy(step, stepdata.m_StepInfo[loop].c_str()); // 해당줄에 대한 스텝 정보를 얻어옴
			bool empty = true;
			for(int i=0; i<10; i++)
			{
				if(step[i] != '0')
				{
					empty = false;
					break;
				}
			}
			if(!empty)
				steps.push_back(step);
		}
	}
	if(steps.size() <= 1)
		return;
	vector<tstring>::iterator it = steps.begin();
	it++;
	TCHAR blankstep[14] = TEXT("0000000000000");

	do
	{
		for(int i=0; i<spacevalue; i++)
			it = steps.insert(it, blankstep);	
		for(int i=0; i<spacevalue; i++)
			it++;
		it++;
	}
	while(it != steps.end());

	Remove(rangeS, rangeE);
	stepdata.m_StepInfo.insert(stepdata.m_StepInfo.begin()+rangeS,
		steps.begin(), steps.end());
	vector<tstring> ve;
	vector<tstring> ve2;
	ve.insert(ve.begin(), ve2.begin(), ve2.end());
}

void ksfinfo::createTable()
{
	//1분에 tick * bpm 만큼 감. <-> 1/(tick*bpm) 분에 1만큼 감
	//60초에 tick * bpm 만큼 감 <-> 60/(tick*bpm) 초에 1만큼 감

	timetable.rationalnumbers.erase(timetable.rationalnumbers.begin(), timetable.rationalnumbers.end());
	timetable.result.erase(timetable.result.begin(), timetable.result.end());
	int last = stepdata.m_StepInfo.size();
	RationalNumber tmprn = {0, 1};
	timetable.rationalnumbers[0].push_back(tmprn);
	TCHAR* gabage;
	double bpm = _tcstod(m_BPM1.c_str(), &gabage);
	int tick = m_TickCount;
	tmprn.numerator = m_StartTime1 * 10;
	tmprn.denominator = 1;
	timetable.rationalnumbers[1].push_back(tmprn);
	
	int indexresult=-1;
	getDelay(0, bpm, tick, timetable);
	getTick(0, tick);
	getBpm(0, bpm);
	
	for(int index=1; index<last; index++)
	{
		tmprn.numerator = 60*1000;
		tmprn.denominator = bpm*tick;
		timetable.rationalnumbers[index].push_back(tmprn);
		
		getDelay(index, bpm, tick, timetable);
		getTick(index, tick);
		getBpm(index, bpm);
	}

	vector<RationalNumber> Dynamic;
	Dynamic.push_back(timetable.rationalnumbers[0][0]);
	Dynamic.reserve(timetable.rationalnumbers.size());

	map<int, vector<RationalNumber> >::iterator it=timetable.rationalnumbers.begin();
	it++;
	for(;it != timetable.rationalnumbers.end(); it++)
	{
		RationalNumber tmp;
		tmp.denominator = (Dynamic.end()-1)->denominator;
		tmp.numerator = (Dynamic.end()-1)->numerator;
		for(vector<RationalNumber>::iterator it2=it->second.begin();it2!=it->second.end(); it2++)
		{
			__int64 a, b, c, d;
			a = tmp.numerator;
			b = tmp.denominator;
			c = it2->numerator;
			d = it2->denominator;
			tmp.denominator = b*d;
			tmp.numerator = a*d + b*c;
		}
		__int64 gcd = getGCD(tmp.numerator, tmp.denominator);
		tmp.numerator /= gcd;
		tmp.denominator /= gcd;
		Dynamic.push_back(tmp);
	}

	for(vector<RationalNumber>::iterator it=Dynamic.begin(); it!=Dynamic.end(); it++)
	{
		timetable.result.push_back(it->numerator/it->denominator);
	}
}




bool ksfinfo::getTick(int index, int& t)
{
	int tick=0;
	map<int, vector<tstring> >::const_iterator it = stepdata.m_ChangeOfSpeed.find(index);
	if(stepdata.m_ChangeOfSpeed.end() != it)
	{
		for(int i=0; i<it->second.size(); i++)
		{
			std::tmatch results;
			std::tregex expression;

			{ // Get Tick
				expression = TEXT("\\|T(\\d+)\\|");
				if(regex_match(it->second[i], results, expression))
				{
					std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
					tick = _ttoi(tmp.c_str());
				}
				else
				{
					expression = TEXT("#TICKCOUNT:(\\d+);");
					if(regex_match(it->second[i], results, expression))
					{
						std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
						tick = _ttoi(tmp.c_str());
					}
				}
			}
		}
	}

	if(tick == 0)
		return false;
	else
	{
		t = tick;
		return true;
	}
}



bool ksfinfo::getBpm(int index, double& b)
{
	double bpm = 0;
	TCHAR* gabage;
	map<int, vector<tstring> >::const_iterator it = stepdata.m_ChangeOfSpeed.find(index);
	if(stepdata.m_ChangeOfSpeed.end() != it)
	{
		for(int i=0; i<it->second.size(); i++)
		{
			std::tmatch results;
			std::tregex expression;

			{ // Get BPM
				expression = (TEXT("\\|B(\\d+\\.?\\d+|\\d+)\\|"));

				if(regex_match(it->second[i], results, expression))
				{
					std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
					bpm = _tcstod(tmp.c_str(), &gabage);
				}
				else
				{
					expression = (TEXT("#BPM:(\\d+\\.?\\d+|\\d+);"));

					if(regex_match(it->second[i], results, expression))
					{
						std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
						bpm = _tcstod(tmp.c_str(), &gabage);
					}
				}
			}

		}
	}
	if(bpm == 0)
		return false;
	else
	{
		b = bpm;
		return true;
	}
}


void ksfinfo::getDelay(int index, double b, int t, TimeTable& tt)
{
	int tick = t; // 초기값, 딜레이 비트 넣는 데이터에서 틱을 안건드는 경우를 대비(이게 일반적임, )
	
	double bpm = b; // 초기값, 딜레이 비트 넣는 데이터에서 BPM을 안건드는 경우를 대비(이게 일반적임)

	TCHAR* gabage;
	map<int, vector<tstring> >::const_iterator it = stepdata.m_ChangeOfSpeed.find(index);
	if(stepdata.m_ChangeOfSpeed.end() != it)
	{
		for(int i=0; i<it->second.size(); i++)
		{
			std::tmatch results;
			std::tregex expression;


			{ // Get Tick
				expression = TEXT("\\|T(\\d+)\\|");
				if(regex_match(it->second[i], results, expression))
				{
					std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
					tick = _ttoi(tmp.c_str());
				}

				expression = TEXT("#TICKCOUNT:(\\d+);");
				if(regex_match(it->second[i], results, expression))
				{
					std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
					tick = _ttoi(tmp.c_str());
				}
			}

			{ // Get BPM
				expression = (TEXT("\\|B(\\d+\\.?\\d+|\\d+)\\|"));

				if(regex_match(it->second[i], results, expression))
				{
					std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
					bpm = _tcstod(tmp.c_str(), &gabage);
				}

				expression = (TEXT("#BPM:(\\d+\\.?\\d+|\\d+);"));

				if(regex_match(it->second[i], results, expression))
				{
					std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
					bpm = _tcstod(tmp.c_str(), &gabage);
				}
			}
				
			{ // Get Delayms
				expression = TEXT("\\|D(\\d+)\\|");
				if(regex_match(it->second[i], results, expression))
				{
					std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
					RationalNumber tmprn;
					
					tmprn.numerator = _ttoi(tmp.c_str());
					tmprn.denominator = 1;
					tt.rationalnumbers[index+1].push_back(tmprn);
				}

				expression = TEXT("#DELAY:(\\d+);");
				if(regex_match(it->second[i], results, expression))
				{
					std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
					RationalNumber tmprn;
					tmprn.numerator = _ttoi(tmp.c_str());
					tmprn.denominator = 1;
					tt.rationalnumbers[index+1].push_back(tmprn);
				}

				expression = TEXT("\\|E(\\d+)\\|");
				if(regex_match(it->second[i], results, expression))
				{
					std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
					RationalNumber tmprn;
					tmprn.numerator = _ttoi(tmp.c_str())*60000;
					tmprn.denominator = bpm*tick;
					tt.rationalnumbers[index+1].push_back(tmprn);
				}

				expression = TEXT("#DELAYBEAT:(\\d+);");
				if(regex_match(it->second[i], results, expression))
				{
					std::basic_string<TCHAR> tmp(results[1].first, results[1].second);
					RationalNumber tmprn;
					tmprn.numerator = _ttoi(tmp.c_str())*60000;
					tmprn.denominator = bpm*tick;
					tt.rationalnumbers[index+1].push_back(tmprn);
				}
			}
		}
	}
}



int ksfinfo::timeToIndex(int t)
{
	int last = stepdata.m_StepInfo.size();

	for(int index=1; index<last; index++)
	{
		if(timetable.result[index-1] <= t && t < timetable.result[index])
		{
			return index-1;
			break;
		}
	}

	return 0;
}

int ksfinfo::indexToTime(int in)
{
	return timetable.result[in];
}

template <typename T> T ksfinfo::getGCD(T u, T v)
{
	T tmp;
	while(v)
	{
		tmp = u%v;
		u = v;
		v = tmp;
	}
	return u;
}

template<class T> void ksfinfo::swap(T& a, T& b)
{
	T t = a;
	a = b;
	b = t;
}




void ksfinfo::getFromRegExp(tstring& dest, const std::tstring& str, tmatch& results, const tstring& exp)
{
	tregex expression;
	expression = exp;
	if(regex_search(str, results, expression))
	{
		dest.assign(results[1].first, results[1].second);
	}
}

void ksfinfo::getFromRegExp(int& dest, const std::tstring& str, tmatch& results, const tstring& exp)
{
	tregex expression;
	expression = exp;
	if(regex_search(str, results, expression))
	{
		std::tstring match(results[1].first, results[1].second);
		dest = _ttoi(match.c_str());
	}
}


