<?php

namespace App\Models\v2;

use App\Models\BaseModel;
use Illuminate\Support\Facades\DB;

class Ad extends BaseModel
{
    protected $connection = 'shop';

    protected $table      = 'ad';

    public    $timestamps = false;

    protected $hidden = [];

    protected $guarded = [];



    protected $visible = ['ad_id','id','link','title','thumb','large', 'sort', 'position_id','enabled','ad_link', 'ad_code', 'start_time', 'end_time'];
    protected $fillable = ['ad_id', 'position_id','enabled','ad_link', 'ad_code', 'start_time', 'end_time'];


    public static function getListByPosition(array $attributes)
    {
        extract($attributes);

        $model = Ad::whereIn('position_id', $position_id);
        $total = $model->count();

        $data = $model
            ->select('ad_id as id' , 'ad_link as link', 'ad_name as title', 'ad_id as sort', 'ad_code as thumb', 'ad_code as large' )
            ->orderBy('id', 'asc')
            ->paginate($per_page)
            ->toArray();

        if(is_array($data['data']) && count($data['data'])) {

            $dir = '/data/afficheimg/';
            foreach ($data['data'] as &$row) {
                $row['photo'] = [
                    'width' => null,
                    'height' => null,
                    'thumb' => $dir . $row['thumb'],
                    'large' => $dir . $row['large']
                ];
            }
        }


        return self::formatBody(['banners' => $data['data'], 'paged' => self::formatPaged($page, $per_page, $total)]);
    }


    /*public static function getArticle($id)
    {
        $data = [];
        if($model = Article::where('article_id', $id)->first()){
            $data['title'] = $model->title;
            $data['content'] = $model->content;
            $data['add_time'] = $model->add_time;
        }

        return view('article.mobile', ['article' => $data]);
    }


    public function getIdAttribute()
    {
        return $this->attributes['article_id'];
    }

    public function getUrlAttribute()
    {
        return url('/v2/article.'.$this->attributes['article_id']);
    }

    public function getCreatedAtAttribute()
    {
        return $this->attributes['add_time'];
    }

    public function getUpdatedAtAttribute()
    {
        return $this->attributes['add_time'];
    }

    public function getMoreAttribute()
    {
        return false;
    }*/

}
