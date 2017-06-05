var Student = (function () {
    function Student(firstname, middleinitial, lastname) {
        this.firstname = firstname;
        this.middleinitial = middleinitial;
        this.lastname = lastname;
        this.fullname = firstname + " " + middleinitial + " " + lastname;
    }
    return Student;
}());
function greeter(person) {
    return "Hello, " + person.firstname + " " + person.lastname;
}
var user = new Student("Jane", "M.", "User");
document.body.innerHTML = greeter(user);
function KSFInfo() {
    this.title = "";
    this.player = "";
    this.bpm1 = "";
    this.startTime1;
    this.tickCount = 4; // 1,2,3,4,5,6,7,8
}
/*
#pragma once

//#include <regex>
#include <string>
#include <vector>
#include <map>
#include <deque>

namespace std { typedef basic_string<TCHAR> tstring; }
namespace std { typedef basic_regex<TCHAR> tregex; }
namespace std { typedef match_results<tstring::const_iterator> tmatch; }

using namespace std::tr1;
using std::tmatch;
using std::tregex;
using std::tstring;
using std::map;
using std::vector;
using std::deque;


class ksfinfo;
template<class T> class Do
{
private:
    enum {SIZE=50};
public:
    Do()
    {
        index = -1;
    }
    ~Do()
    {
        //datalist.erase(datalist.begin(), datalist.end());
    }
    void saveHistory(const T& data)
    {
    }
    T* unDo()
    {
        return index>0 ? &datalist[--index] : 0;
    }
    T* reDo()
    {
        if(datalist.size()-1 > index)
            return &datalist[++index];
        else
            return 0;
    }
private:
    size_t index;
    std::vector<T> datalist;
};


class ksfinfo
{
private:
    struct StepData
    {
        vector<tstring> m_StepInfo;
        map<int, vector<tstring> > m_ChangeOfSpeed;
    }stepdata;

    struct RationalNumber
    {
        unsigned __int64 numerator;
        unsigned __int64 denominator;
    };

    struct TimeTable
    {
        map<int, vector<RationalNumber> > rationalnumbers;   // 분자와 분모
        vector<double> result;
    }timetable;


    template <typename T> T getGCD(T u, T v);
    bool getTick(int index, int& t);
    bool getBpm(int index, double& b);
    void getDelay(int index, double b, int t, TimeTable& tt);
    template<class T> void swap(T& a, T& b);
    void getFromRegExp(tstring& dest, const std::tstring& str, tmatch& results, const tstring& exp);
    void getFromRegExp(int& dest, const std::tstring& str, tmatch& results, const tstring& exp);
    
public:
    Do<StepData> unredo;
public:
    tstring m_Title;
    tstring m_Player; // 생략가능
    tstring m_BPM1;
    int m_StartTime1;
    int m_TickCount; //1,2,3,4,5,6,7,8
    tstring m_IntroFile; // 생략가능
    tstring m_SongFile; // 생략가능
    tstring m_DiscFile; // 생략가능
    tstring m_TitleFile; // 생략가능
    int m_Difficulty; // 생략가능
    tstring m_BPM2; // 생략가능
    tstring m_BPM3; // 생략가능
    int m_BunKi1; // 생략가능
    int m_BunKi2; // 생략가능
    int m_StartTime2; // 생략가능
    int m_StartTime3; // 생략가능

    const vector<tstring>& getStepInfo() {return stepdata.m_StepInfo;}
    const map<int, vector<tstring> >& getChangeOfSpeed() {return stepdata.m_ChangeOfSpeed;}
    const StepData& getStepData(){return stepdata;}
//	const vector<tstring>& getStepInfo() const{return m_StepInfo;}

    
    void IncCosFrom(int endsel);

public:
    ksfinfo();
    ~ksfinfo();
//	int GetEnd(){return m_EndSelect;}
    BOOL LoadKSF(const TCHAR* path);
    BOOL SaveKSF(const TCHAR* path);
    void SetStep(bool doublemode, int position, int beginsel, int endsel);
    void Rotation(int player, int rotation, int s, int e);
    void Insert(int e, int size);
    void Pushback(int size);
    void Remove(int bs, int es);
    int InputTextInfo(const TCHAR* data, int e);
    void ChangeCos(int steppos, tstring str);
    void setStepData(const StepData* sd);
    void setSpace(int rangeS, int rangeE, bool Double, unsigned int spacevalue);
    void createTable();
    int timeToIndex(int t);
    int indexToTime(int in);
};


*/
//새로운 다무에서 지원하는 변속방법
/*#TICKCOUNT: 정수; (또는 |T정수|)
    헤더 부분의 #TICKCOUNT 값을 바꾼다.
#BPM: 실수; (또는 |B실수|)
        변속을 나타내며, 해당 위치에서 BPM 값을 변경한다.
#DELAY: 정수; (또는 |D정수|)
        해당 위치에서 오브젝트가 올라오는 것을 지정한 시간(1/1000초 단위)만큼 중단한다.
#DELAYBEAT: 정수; (또는 |E정수|)
        해당 위치에서 오브젝트가 올라오는 것을 지정한 시간(1마디 단위)만큼 중단한다.
    */
